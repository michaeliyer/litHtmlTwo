import { theNames } from './allNames.js';
const inputs = {
  firstName: document.getElementById("firstName"),
  lastName: document.getElementById("lastName"),
  birthMonth: document.getElementById("birthMonth"),
  birthDay: document.getElementById("birthDay"),
  birthYear: document.getElementById("birthYear")
};

const resultsDiv = document.getElementById("results");
const clearBtn = document.getElementById("clearBtn");

function filterNames() {
  const query = {
    firstName: inputs.firstName.value.trim().toLowerCase(),
    lastName: inputs.lastName.value.trim().toLowerCase(),
    birthMonth: inputs.birthMonth.value.trim().toLowerCase(),
    birthDay: inputs.birthDay.value.trim(),
    birthYear: inputs.birthYear.value.trim()
  };

  const results = theNames.filter(aHuman => {
    return (
      (!query.firstName || aHuman.firstName.toLowerCase().startsWith(query.firstName)) &&
      (!query.lastName || aHuman.lastName.toLowerCase().startsWith(query.lastName)) &&
      (!query.birthMonth || (aHuman.birthMonth && aHuman.birthMonth.toLowerCase() === query.birthMonth)) &&
      (!query.birthDay || aHuman.birthDay == query.birthDay) &&
      (!query.birthYear || aHuman.birthYear == query.birthYear)
    );
  });

  // ✅ Sort by lastName, case-insensitive
  results.sort((a, b) => {
    const nameA = a.lastName?.toLowerCase() || "";
    const nameB = b.lastName?.toLowerCase() || "";
    return nameA.localeCompare(nameB);
  });
  displayResults(results);
}

function displayResults(results) {
  resultsDiv.innerHTML = "";
  if (results.length === 0) {
    resultsDiv.innerHTML = "<p>No matches found.</p>";
    return;
  }

  results.forEach(aHuman => {
    const div = document.createElement("div");
    div.className = "result";
    div.innerHTML = `
      <strong>${aHuman.firstName} ${aHuman.lastName}</strong><br>
      Born: ${aHuman.birthMonth || "-"} ${aHuman.birthDay || ""}, ${aHuman.birthYear || "-"}
    `;
    resultsDiv.appendChild(div);
  });
}

Object.values(inputs).forEach(input => {
  input.addEventListener("input", filterNames);
});

clearBtn.addEventListener("click", () => {
  Object.values(inputs).forEach(input => {
    if (input.tagName === "SELECT") input.selectedIndex = 0;
    else input.value = "";
  });
  displayResults(theNames);
});

displayResults(theNames);