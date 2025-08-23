import { Request, Response } from "express";
import { getInstitutionService } from "../../services/instituicao/get-institution.service";

export const getInstitutionController = async (req: Request, res: Response) => {
    try {
        const institutions = await getInstitutionService();
        if(!institutions || institutions.length === 0) {
            console.error("Lista de instituições vazia");
            res.status(404).json({ error: "Lista de instituições vazia" });
            return;
        }

        res.status(200).json(institutions);
        return;
    } catch (error) {
        console.error("Erro ao buscar instituições:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
        return;
    }

}