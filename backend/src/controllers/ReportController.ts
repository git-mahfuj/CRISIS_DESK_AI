import { Report } from "../models/ReportSchema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import type { Request, Response, NextFunction } from "express"
import { ai } from "../utils/AiHelper.js";


const createReportHandler = (asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    console.log("Incoming Data from Postman: ", req.body);

    const { name, contact, location, description } = req.body;

    if ([name, contact, location, description].some((item) => !item || item.trim() === "")) {
        return res.status(400).json(
            new ApiError(400, "All field required")
        )

    }

    try {
        const prompt = `Process this citizen text description : ${description}`;
        const systemInstruction = `
        You are an emergency response triage system. 
    You must ONLY reply with a valid JSON object. Do not include markdown formatting or extra text.
    The JSON must have this exact structure:
    {
     "language" : "bn , en or unknown",
      "category": "medical, fire, accident, crime, flood, utility, public_service, infrastructure, or other",
      "urgency": "low, medium, high, or critical",
      "summary": "A short AI-generated summary in English.",
      "suggestedAction": "Recommended emergency action for responders.",
      "confidence": 0 - 1,
    }
    `

        const interaction = await ai.interactions.create({
            model: 'gemini-3.5-flash',
            input: prompt,
            system_instruction: systemInstruction,
            response_format: {
                type: "text"
            },
        })

        const output = interaction.output_text

        const jsonOutput = JSON.parse(output as string)

        const reportLanguage = jsonOutput.language
        const reportCategory = jsonOutput.category
        const reportUrgency = jsonOutput.urgency
        const reportSummary = jsonOutput.summary
        const reportsuggestedAction = jsonOutput.suggestedAction
        const reportconfidence = jsonOutput.confidence



        const report = await Report.create({
            name: name.toLowerCase(),
            contact,
            location,
            description,
            language: reportLanguage,
            category: reportCategory,
            urgency: reportUrgency,
            summary: reportSummary,
            suggestedAction: reportsuggestedAction,
            confidence: reportconfidence

        })


        return res.status(201).json(
            new ApiResponse(201, report, "Report Created Successfully")
        )

    } catch (error) {
        console.log(error)
        return res.status(500).json(
            new ApiError(500, "Failed to Create Report")
        )
    }
}))


const getReportHandler = (asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const reports = await Report.find({})
    return res.status(201).json(
        new ApiResponse(201, reports, "All Reports Fetched")
    )
}))

const getReportByIdHandler = (asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json(
            new ApiError(400, "Please provide ID")
        )
    }

    const reportById = await Report.findById(id);

    if (!reportById) {
        return res.status(400).json(
            new ApiError(400, "Report not found")
        )
    }

    return res.status(201).json(
        new ApiResponse(201, reportById, "ReportByID")
    )
}))


const deleteReportByIdHandler = (asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json(
            new ApiError(400, "Please provide ID")
        )
    }

    const deletedReport = await Report.findByIdAndDelete(id)

    if (!deletedReport) {
        return res.status(400).json(
            new ApiError(400, "Report Not Found")
        )
    }

    return res.status(201).json(
        new ApiResponse(201, deletedReport, "Deleted ID Via Report")
    )

}))

export { createReportHandler, getReportHandler, getReportByIdHandler, deleteReportByIdHandler }