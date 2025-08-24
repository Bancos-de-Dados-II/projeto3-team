document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = './login.html';
    return;
  }

  const API_URL = "http://localhost:3000/institutions";
  const NOMATIM_URL = "https://nominatim.openstreetmap.org/search";

  let map,
    temporaryMarker,
    institutionMarkers,
    institutionsCache = [];
  let editState = { isEditing: false, id: null };

  const formModal = document.getElementById("form-modal");
  const addInstitutionBtn = document.getElementById("add-institution-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const institutionForm = document.getElementById("institution-form");
  const sidebar = document.getElementById("sidebar");
  const toggleOpenBtn = document.getElementById("toggle-sidebar-btn-open");
  const toggleCloseBtn = document.getElementById("toggle-sidebar-btn-close");
  const logoutBtn = document.getElementById("logout-btn");

  function initMap() {
    map = L.map("map").setView([-6.7595, -38.2312], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);
    institutionMarkers = L.layerGroup().addTo(map);
    map.on("click", onMapClick);
    loadInstitutions();
  }

  function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async function loadInstitutions() {
    try {
      const response = await fetch(API_URL);
      if (response.status === 404) {
        institutionsCache = [];
      } else if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      } else {
        const institutions = await response.json();
        institutionsCache = institutions.filter(inst => inst.localization && inst.localization.coordinates);
      }
      renderAll();
    } catch (error) {
      handleFetchError(error, "carregar");
    }
  }

  function renderAll() {
    institutionMarkers.clearLayers();
    renderSidebarList(institutionsCache);
    institutionsCache.forEach(addInstitutionMarker);
  }

  function renderSidebarList(institutions) {
    const listEl = document.getElementById("institution-list");
    listEl.innerHTML = "";
    if (institutions.length === 0) {
      listEl.innerHTML =
        '<p class="text-center text-gray-500 mt-4">Nenhuma instituição cadastrada.</p>';
      return;
    }
    institutions.forEach((inst) => {
      const item = document.createElement("div");
      item.className = "p-3 border-b hover:bg-gray-100 cursor-pointer";
      item.innerHTML = `
                        <h4 class="font-semibold text-gray-800">${inst.name}</h4>
                        <p class="text-sm text-gray-600 truncate">${inst.description}</p>
                        <div class="mt-2 flex gap-2">
                            <button data-action="edit" data-id="${inst.id}" class="text-xs text-blue-600 hover:underline">Editar</button>
                            <button data-action="delete" data-id="${inst.id}" class="text-xs text-red-600 hover:underline">Excluir</button>
                        </div>`;
      item.addEventListener("click", (e) => {
        if (e.target.dataset.action === "edit") {
          openForm("edit", inst);
        } else if (e.target.dataset.action === "delete") {
          handleDelete(inst.id);
        } else {
          const targetInst = institutionsCache.find((i) => i.id === inst.id);
          if (targetInst && targetInst.marker) {
            map.setView(targetInst.marker.getLatLng(), 15);
            targetInst.marker.openPopup();
          }
        }
      });
      listEl.appendChild(item);
    });
  }

  function addInstitutionMarker(institution) {
    if (!institution.localization?.coordinates) return;
    const [lng, lat] = institution.localization.coordinates;
    const popupContent = `
                    <div class="custom-popup" data-id="${institution.id}">
                        <h3>${institution.name}</h3>
                        <p><strong>CNPJ:</strong> ${institution.cnpj}</p>
                        <p><strong>Contato:</strong> ${institution.contact}</p>
                        <p><strong>Descrição:</strong> ${institution.description}</p>
                    </div>`;
    institution.marker = L.marker([lat, lng])
      .addTo(institutionMarkers)
      .bindPopup(popupContent);
  }

  function openForm(mode = "create", institution = null) {
    institutionForm.reset();
    const cnpjField = document.getElementById("cnpj");
    if (mode === "edit" && institution) {
      editState = { isEditing: true, id: institution.id };
      document.getElementById("form-title").textContent = "Editar Instituição";
      document.getElementById("submit-btn").textContent = "Atualizar";
      document.getElementById("institutionId").value = institution.id;
      document.getElementById("name").value = institution.name;
      cnpjField.value = institution.cnpj;
      cnpjField.disabled = true; 
      document.getElementById("contact").value = institution.contact;
      document.getElementById("description").value = institution.description;
      const [lng, lat] = institution.localization.coordinates;
      updateFormLocation(lat, lng);
      map.setView([lat, lng], 15);
    } else {
      editState = { isEditing: false, id: null };
      document.getElementById("form-title").textContent = "Nova Instituição";
      document.getElementById("submit-btn").textContent = "Salvar";
      cnpjField.disabled = false;
    }
    formModal.classList.remove("hidden");
  }

  const closeForm = () => {
    formModal.classList.add("hidden");
    institutionForm.reset();
    if (temporaryMarker) {
      map.removeLayer(temporaryMarker);
      temporaryMarker = null;
    }
  };

  function onMapClick(e) {
    if (!formModal.classList.contains("hidden")) {
      updateFormLocation(e.latlng.lat, e.latlng.lng);
    }
  }

  function updateFormLocation(lat, lng) {
    document.getElementById("positionX").value = lng;
    document.getElementById("positionY").value = lat;
    if (!temporaryMarker) {
      temporaryMarker = L.marker([lat, lng], { draggable: true }).addTo(map);
      temporaryMarker.on("dragend", (e) =>
        updateFormLocation(e.target.getLatLng().lat, e.target.getLatLng().lng)
      );
    } else {
      temporaryMarker.setLatLng([lat, lng]);
    }
    map.panTo([lat, lng]);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(institutionForm);
    const data = Object.fromEntries(formData.entries());
    if (!data.positionX || !data.positionY) {
      showToast("Defina a localização no mapa.", "error");
      return;
    }
    const payload = {
      name: data.name,
      contact: data.contact,
      description: data.description,
      positionX: parseFloat(data.positionX),
      positionY: parseFloat(data.positionY),
    };

    if (!editState.isEditing) {
      payload.cnpj = data.cnpj;
    }

    const url = editState.isEditing ? `${API_URL}/${editState.id}` : API_URL;
    const method = editState.isEditing ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Erro desconhecido");
      }
      
      showToast(
        `Instituição ${editState.isEditing ? "atualizada" : "criada"} com sucesso!`,
        "success"
      );
      closeForm();
      loadInstitutions();
    } catch (error) {
      handleFetchError(error, "salvar");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Tem certeza que deseja excluir esta instituição?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { 
          method: "DELETE",
          headers: getAuthHeaders()
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Erro desconhecido");
      }
      showToast("Instituição excluída com sucesso!", "success");
      loadInstitutions();
    } catch (error) {
      handleFetchError(error, "excluir");
    }
  }

  // --- UI ---
  addInstitutionBtn.addEventListener("click", () => openForm("create"));
  cancelBtn.addEventListener("click", closeForm);
  institutionForm.addEventListener("submit", handleFormSubmit);

  toggleOpenBtn.addEventListener("click", () =>
    sidebar.classList.remove("-ml-[100%]")
  );
  toggleCloseBtn.addEventListener("click", () =>
    sidebar.classList.add("-ml-[100%]")
  );
  
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    window.location.href = './login.html';
  });

  document
    .getElementById("search-btn")
    .addEventListener("click", searchAddress);
  document.getElementById("address-search").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchAddress();
    }
  });

  async function searchAddress() {
    const query = document.getElementById("address-search").value;
    const resultsDiv = document.getElementById("search-results");
    if (query.length < 3) return;
    resultsDiv.textContent = "Buscando...";
    try {
      const response = await fetch(
        `${NOMATIM_URL}?format=json&q=${encodeURIComponent(query)}&countrycodes=br`,
        { headers: { "User-Agent": "InstituicoesApp/1.0" } }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const best = data[0];
        resultsDiv.textContent = `Encontrado: ${best.display_name}`;
        updateFormLocation(parseFloat(best.lat), parseFloat(best.lon));
        map.setView([best.lat, best.lon], 15);
      } else {
        resultsDiv.textContent = "Endereço não encontrado.";
      }
    } catch (error) {
      console.error("Erro na geocodificação:", error);
      resultsDiv.textContent = "Falha ao buscar endereço.";
    }
  }

  function handleFetchError(error, action) {
    console.error(`Erro ao ${action} instituição:`, error);
    let userMessage = `Falha ao ${action}. Verifique a conexão.`;
    
    if (error.message.includes("Token") || error.message.includes("autenticado")) {
        userMessage = "Sua sessão expirou. Por favor, faça login novamente.";
        setTimeout(() => {
            logoutBtn.click();
        }, 3000);
    } else if (error instanceof TypeError && error.message.includes("fetch")) {
      userMessage = `Erro de conexão: Verifique se o servidor back-end está rodando.`;
    } else if (error.message) {
      userMessage = `Erro ao ${action}: ${error.message}`;
    }
    showToast(userMessage, "error");
  }

  function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");
    toastMessage.textContent = message;
    toast.className = `fixed bottom-5 right-5 z-40 px-5 py-3 rounded-lg text-white ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 5000);
  }

  initMap();
});
