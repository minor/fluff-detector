import Instructor from "@instructor-ai/instructor";
import OpenAI from "openai"
import { z } from "zod"

export async function POST(request: Request) {

    const requestBody = await request.json();
    const inputText = requestBody.text;
    const prompt = `You are a professional writer. You write simple, clear, and concise content. You are aware that good writing is full but not bloated; it develops its topic but communicates its points clearly and efficiently. "Fluff" in writing fills up space without saying anything new. Given the following text, delimited by three dashes (-), your task is to isolate the thesis and 1) determine where the writing has "fluff" and 2) write a potential fix for the "fluff". Then, at the end, 3) report a "Fluff Score" which is a percentage of the amount of "fluff" words over the total amount of words.\n\n---` + inputText + `\n\n--- `

    const oai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY ?? undefined
    })

    const client = Instructor({
        client: oai,
        mode: "FUNCTIONS"
    })

    const responseSchema = z.object({
        // Description will be used in the prompt
        score: z.number().describe("The numerical score of the fluff score, which is a percentage of the amount of fluff words over the total amount of words."), 
        suggestions: z.array(z.object({
            fluff: z.string().describe("The fluff text"),
            suggestion: z.string().describe("A replacement of the original text that has fluff to eliminate the fluff")
        })).describe("A list of suggestions for replacing fluff in the text.")
    })

    try {
        const response = await client.chat.completions.create({
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: inputText }
            ],
            model: "gpt-4o",
            response_model: { 
                schema: responseSchema, 
                name: "Response"
            }
        });

        // console.log(response);
        // console.log(response.suggestions);
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("Error in API call:", error);
        return new Response(JSON.stringify({ error: "Failed to process the request" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
