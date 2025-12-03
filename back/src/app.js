const express = require('express');
const cors = require('cors');
const axios = require('axios');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({message: "Server is running"});
})

app.post("/api/questions",async (req,res)=>{
    try{
        const QuestionCount = req.body.questionCount;
        const Topic = req.body.topic;
        if ((!Topic || Topic === "")) {
            return res.status(400).json({ error: "Topic is required" });
        }
        const API_KEY = process.env.GEMINI_KEY;
        const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
            contents: [{
                parts: [{
                text: `Generate exactly ${QuestionCount === "" ? 7 : QuestionCount} multiple choice questions about ${Topic}. 
                Questions should progressively get harder for example if there are 7 questions:
                - Questions 1-2: Easy (basic concepts)
                - Questions 3-4: Medium (requires understanding)
                - Questions 5-7: Hard (requires deep knowledge or critical thinking)

                Return ONLY valid JSON (no markdown formatting, no code blocks) in this exact structure:
                {
                    "questions": [
                    {
                        "question": "Question text here?",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "correctAnswer": 0,
                        "difficulty": "easy"
                    }
                    ]
                }
                Make questions engaging and educational. correctAnswer should be the index (0-3) of the correct option.
                Make sure that the options short not too long and clearly distinct and concise.
                Difficulty should be "easy", "medium", or "hard".
                `
                }]
            }]            
        },
        {
          headers: { "Content-Type": "application/json" }
        }
        )
        res.json(response.data);
        console.log(response.data);
    }catch(error){
        console.error("Gemini API Error:", error.response?.data || error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
})

module.exports = app;