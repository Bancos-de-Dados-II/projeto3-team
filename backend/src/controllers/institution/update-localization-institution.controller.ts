import { Request, Response } from "express";
import { updateLocalizationInstitutionService } from "../../services/instituicao/update-localization-institution.service";

export const updateLocalizationInstitutionController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { positionX, positionY } = req.body;
        if (!id || !positionX || !positionY) {
            res.status(400).json({ error: "Preencha todos os campos" });
            return;
        }
        await updateLocalizationInstitutionService(id, positionX, positionY);
        res.status(200).json({ message: "Localização da instituição atualizada com sucesso" });
        return;
    } catch (error) {
        console.error("Erro ao atualizar a localização da instituição:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
        return;
    }
}