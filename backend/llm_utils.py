import re

def clean_llm_output(answer: str) -> str:
    # Remove triple backtick blocks
    answer = re.sub(r"```[\s\S]*?```", "", answer)
    answer = re.sub(r"^```.*?$", "", answer, flags=re.MULTILINE)

    # Remove "thinking out loud" lines
    patterns = [r"^no[, ]+i (should|did)", r"^i will try", r"^here is the answer",
                r"^i made.*mistake", r"^let me", r"^this is the answer",
                r"^oops", r"^correct", r"^answer:", r"^assistant[: ]?"]
    for pat in patterns:
        answer = re.sub(pat, "", answer, flags=re.IGNORECASE | re.MULTILINE)

    # Deduplicate lines
    lines = [line.strip() for line in answer.splitlines() if line.strip()]
    seen = set()
    deduped = []
    for line in lines:
        if line.lower() not in seen:
            seen.add(line.lower())
            deduped.append(line)
    return "\n".join(deduped).strip()
