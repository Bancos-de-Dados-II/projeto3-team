import { getSession } from '../../../database/neo4j';
import { randomUUID } from 'crypto';

export async function createInstitutionNeo4j(
  id: string,
  name: string,
  cnpj: string,
  contact: string,
  description: string,
  positionX: number,
  positionY: number,
  userId?: string
) {
  const session = getSession();
  console.log(id);


  try {
    // Cria a instituição e conecta ao usuário se userId existir
    await session.run(
      `
      MATCH (u:User {id: $userId})
      CREATE (i:Institution {
        id: $id,
        name: $name,
        cnpj: $cnpj,
        contact: $contact,
        description: $description,
        positionX: $positionX,
        positionY: $positionY
      })
      MERGE (u)-[:CREATED]->(i)
      RETURN i
      `,
      {
        id,
        name,
        cnpj,
        contact,
        description,
        positionX,
        positionY,
        userId: userId || null
      }
    );
  } finally {
    await session.close();
  }
}


//UPDATE 
export async function updateInstitutionNeo4j(id: string, data: { name?: string; contact?: string; description?: string; positionX?: number; positionY?: number }) {
    const session = getSession();
    const sets: string[] = [];
    const params: any = { id };

    if (data.name) { sets.push("i.name = $name"); params.name = data.name; }
    if (data.contact) { sets.push("i.contact = $contact"); params.contact = data.contact; }
    if (data.description) { sets.push("i.description = $description"); params.description = data.description; }
    if (data.positionX !== undefined) sets.push("i.positionX = $positionX"), params.positionX = data.positionX;
    if (data.positionY !== undefined) sets.push("i.positionY = $positionY"), params.positionY = data.positionY;

    if (sets.length === 0) return; // nada para atualizar

    const query = `MATCH (i:Institution {id: $id}) SET ${sets.join(", ")}`;
    try {
        await session.run(query, params);
    } finally {
        await session.close();
    }
}

//READ
export async function getInstitutionNeo4j() {
    const session = getSession();
  try {
    const result = await session.run(
      'MATCH (i:Institution) RETURN i'
    );

    const institutions = result.records.map(record => {
      const node = record.get('i').properties;
      return {
        id: node.id,
        name: node.name,
        cnpj: node.cnpj,
        contact: node.contact,
        description: node.description,
        localization: {
          type: "Point",
          coordinates: [node.positionX, node.positionY]
        },
        createdAt: node.createdAt,
        updatedAt: node.updatedAt
      };
    });

    return institutions;
  } finally {
    await session.close();
  }
}

//DELETE
export async function deleteInstitutionNeo4j(id: string) {
    const session = getSession();
    try {
        const result = await session.run(
            'MATCH (i:Institution {id: $id}) DETACH DELETE i',
            { id }
        );

        if (result.summary.counters.updates().nodesDeleted === 0) {
            throw new Error("Instituição não encontrada");
        }
    } finally {
        await session.close();
    }
}
