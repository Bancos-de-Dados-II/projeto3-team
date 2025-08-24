import { Request, Response } from "express";
import { getIdInstitutionService } from "../../services/instituicao/get-id-institution.service";

export const getIdInstitutionController = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const institution = await getIdInstitutionService(id);
        res.status(200).json(institution);
        return;
    }
    catch (error) {
        console.error("Erro ao listar a instituição:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
        return;
    }
}
