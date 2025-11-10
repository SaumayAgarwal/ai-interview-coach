from openai import OpenAI


def ai_generate_questions(company, branch, round_type, experience, api_key):
    client = OpenAI(api_key=api_key)
    prompt = f"""
    Generate 4 realistic interview questions for a {round_type} interview.
    Company: {company}
    Candidate branch/role: {branch}
    Candidate level: {experience}

    Provide the questions only, numbered 1–4, and keep them concise.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an expert HR interviewer."},
            {"role": "user", "content": prompt}
        ]
    )

    # Extract clean question list
    content = response.choices[0].message.content.strip()
    questions = [
        line.strip("0123456789. ").strip()
        for line in content.split("\n")
        if line.strip()
    ]

    return questions
