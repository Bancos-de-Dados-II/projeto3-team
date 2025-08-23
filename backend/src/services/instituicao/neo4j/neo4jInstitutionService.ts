import { getSession } from '../../../database/neo4j';

//Create
export async function createInstitutionNeo4j(id: string, name: string, cnpj: string, contact: string, description: string, positionX: number, positionY: number) {
    const session = getSession();
    try {
        await session.run(
            'CREATE (i:Institution {id: $id, name: $name, cnpj: $cnpj, contact: $contact, description: $description, positionX: $positionX, positionY: $positionY})',
            { id, name, cnpj, contact, description, positionX, positionY }
        );
    } finally {
        await session.close();
    }
}

//UPDATE 
export async function updateInstitutionNeo4j(id: string, data: {name?: string; contact?: string; description?: string; positionX?: number; positionY?: number}) {
  const session = getSession();
  const sets: string[] = [];
  const params: any = { id };

  if(data.name) { sets.push("i.name = $name"); params.name = data.name; }
  if(data.contact) { sets.push("i.contact = $contact"); params.contact = data.contact; }
  if(data.description) { sets.push("i.description = $description"); params.description = data.description; }
  if (data.positionX !== undefined) sets.push("i.positionX = $positionX"), params.positionX = data.positionX;
  if (data.positionY !== undefined) sets.push("i.positionY = $positionY"), params.positionY = data.positionY;

  if(sets.length === 0) return; // nada para atualizar

  const query = `MATCH (i:Institution {id: $id}) SET ${sets.join(", ")}`;
  try {
    await session.run(query, params);
  } finally {
    await session.close();
  }
}

//DELETE
export async function deleteInstitutionNeo4j(id: string) {
    const session = getSession();
    try{
        await session.run(
            `MATCH (i:Institution {id: $id}) DETACH DELETE i`, {id}
        );
    } finally {
        await session.close();
    }
}
