import { LitElement, html, css } from "https://unpkg.com/lit@2/index.js?module";
import { theNames } from "./theNames.js";

class BirthdayApp extends LitElement {
  static properties = {
    filters: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
      color: #222;
      padding: 2rem 0;
    }
    .search-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(180, 200, 220, 0.12);
      padding: 1rem 1.5rem;
      align-items: center;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }
    input,
    select,
    button {
      padding: 0.5rem 0.7rem;
      font-size: 1.08rem;
      border-radius: 6px;
      border: 1px solid #c3cfe2;
      background: #f8fafc;
      transition: border 0.2s;
    }
    input:focus,
    select:focus {
      outline: none;
      border: 1.5px solid #7b9acc;
    }
    button {
      background: #7b9acc;
      color: #fff;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
    }
    button:hover {
      background: #5a7bb0;
    }
    .person {
      margin-bottom: 1.5rem;
      padding: 1.2rem 1.5rem;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 2px 12px rgba(180, 200, 220, 0.13);
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
      font-size: 1.13rem;
      line-height: 1.6;
      border-left: 5px solid #7b9acc;
    }
    .person strong {
      font-size: 1.22rem;
      color: #3a4a6b;
      letter-spacing: 0.5px;
    }
    .comment {
      margin-top: 0.5rem;
      color: #5a7bb0;
      font-style: italic;
      font-size: 1.05rem;
      word-break: break-word;
    }
    @media (max-width: 600px) {
      .search-bar,
      .person {
        padding: 1rem 0.5rem;
      }
    }
  `;

  constructor() {
    super();
    this.filters = {
      firstName: "",
      lastName: "",
      birthMonth: "",
      birthDay: "",
      birthYear: "",
      family: "",
      passedAway: false,
    };
  }

  updateFilter(field, value) {
    this.filters = { ...this.filters, [field]: value };
  }

  togglePassedAway(e) {
    this.filters = { ...this.filters, passedAway: e.target.checked };
  }

  get filteredPeople() {
    return theNames
      .filter((p) => {
        const fn = this.filters.firstName.toLowerCase();
        const ln = this.filters.lastName.toLowerCase();
        const bm = this.filters.birthMonth.toLowerCase();
        const bd = this.filters.birthDay;
        const by = this.filters.birthYear;
        const family = this.filters.family.toLowerCase();

        return (
          (!fn || p.firstName.toLowerCase().startsWith(fn)) &&
          (!ln || p.lastName.toLowerCase().startsWith(ln)) &&
          (!bm ||
            bm === "all months" ||
            (p.birthMonth && p.birthMonth.toLowerCase() === bm)) &&
          (!bd || p.birthDay == bd) &&
          (!by || p.birthYear == by) &&
          (!family || (p.family && p.family.toLowerCase() === family))
        );
      })
      .sort((a, b) => {
        const last = a.lastName.localeCompare(b.lastName);
        if (last !== 0) return last;
        return a.firstName.localeCompare(b.firstName);
      });
  }

  getMonthCounts() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const counts = {};
    let totalWithBirthdays = 0;

    months.forEach((month) => {
      counts[month] = theNames.filter(
        (p) =>
          p.birthMonth && p.birthMonth.toLowerCase() === month.toLowerCase()
      ).length;
    });

    // Only count entries that have a valid month name
    totalWithBirthdays = theNames.filter(
      (p) =>
        p.birthMonth &&
        months.some(
          (month) => month.toLowerCase() === p.birthMonth.toLowerCase()
        )
    ).length;

    return { counts, totalWithBirthdays };
  }

  clearFilters() {
    this.filters = {
      firstName: "",
      lastName: "",
      birthMonth: "",
      birthDay: "",
      birthYear: "",
      family: "",
    };
  }

  render() {
    // Determine if any filter is active (not empty or checked)
    const anyFilterActive = Object.entries(this.filters).some(
      ([key, value]) => {
        if (key === "passedAway") return value === true;
        return value && value !== "";
      }
    );
    return html`
      <div class="search-bar">
        <input
          placeholder="First Name"
          .value=${this.filters.firstName}
          @input=${(e) => this.updateFilter("firstName", e.target.value)}
        />
        <input
          placeholder="Last Name"
          .value=${this.filters.lastName}
          @input=${(e) => this.updateFilter("lastName", e.target.value)}
        />

        <select @change=${(e) => this.updateFilter("family", e.target.value)}>
          <option value="" ?selected=${!this.filters.family}>
            -- Family --
          </option>
          <option
            value="pet"
            ?selected=${this.filters.family.toLowerCase() === "pet"}
          >
            Pet
          </option>
          <option
            value="my people"
            ?selected=${this.filters.family.toLowerCase() === "my people"}
          >
            My People
          </option>
          <option
            value="jackal's people"
            ?selected=${this.filters.family.toLowerCase() === "jackal's people"}
          >
            Jackal's People
          </option>
          <option
            value="t'sut"
            ?selected=${this.filters.family.toLowerCase() === "t'sut"}
          >
            T'sut
          </option>
          <option
            value="random"
            ?selected=${this.filters.family.toLowerCase() === "random"}
          >
            Random
          </option>
        </select>

        <select
          @change=${(e) => this.updateFilter("birthMonth", e.target.value)}
        >
          <option value="" ?selected=${!this.filters.birthMonth}>
            -- Month --
          </option>
          <option
            value="all months"
            ?selected=${this.filters.birthMonth.toLowerCase() === "all months"}
          >
            All Months (${this.getMonthCounts().totalWithBirthdays})
          </option>
          ${[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month) => {
            const count = this.getMonthCounts().counts[month];
            return html`
              <option
                value=${month.toLowerCase()}
                ?selected=${this.filters.birthMonth.toLowerCase() ===
                month.toLowerCase()}
              >
                ${month} (${count})
              </option>
            `;
          })}
        </select>

        <input
          type="number"
          placeholder="Day"
          .value=${this.filters.birthDay}
          @input=${(e) => this.updateFilter("birthDay", e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          .value=${this.filters.birthYear}
          @input=${(e) => this.updateFilter("birthYear", e.target.value)}
        />

        <button @click=${this.clearFilters}>Clear</button>
      </div>

      ${anyFilterActive
        ? html`
            <div style="margin-bottom: 1rem; font-weight: 500; color: #5a7bb0;">
              ${this.filteredPeople.length}
              result${this.filteredPeople.length !== 1 ? "s" : ""} found
            </div>
            ${this.filteredPeople.length === 0
              ? html`<div>No results found.</div>`
              : ""}
            ${this.filteredPeople.map(
              (person) => html`
                <div class="person">
                  <strong>${person.firstName} ${person.lastName}</strong><br />
                  Born: ${person.birthMonth || "-"} ${person.birthDay || ""},
                  ${person.birthYear || "-"}<br />
                  ${person.passedAway
                    ? html`🕊️ Passed Away: ${person.passedAway} --- RIP
                        ${person.firstName} ${person.lastName}<br />`
                    : ""}
                  ${person.comment
                    ? html`<div class="comment">💬 ${person.comment}</div>`
                    : ""}
                </div>
              `
            )}
          `
        : ""}
    `;
  }
}

customElements.define("birthday-app", BirthdayApp);
