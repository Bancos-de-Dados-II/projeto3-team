import { Request, Response } from "express";
import { deleteInstitutionService } from "../../services/instituicao/delete-institution.service";

export const deleteInstitutionController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteInstitutionService(id);
        res.status(200).json({ message: "Instituição deletada com sucesso!" });
        return;

    } catch (error) {
        console.error("Erro ao deletar a instituição:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
        return;
    }
}