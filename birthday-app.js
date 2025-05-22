import { LitElement, html, css } from 'https://unpkg.com/lit@2/index.js?module';
import { theNames } from './theNames.js';

class BirthdayApp extends LitElement {
  static properties = {
    filters: { state: true }
  };

  static styles = css`
    .search-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    input, select, button {
      padding: 0.4rem;
      font-size: 1rem;
    }
    .person {
      margin-bottom: 1rem;
      padding: 0.5rem;
      border-bottom: 1px solid #ccc;
    }
  `;

  constructor() {
    super();
    this.filters = {
      firstName: '',
      lastName: '',
      birthMonth: '',
      birthDay: '',
      birthYear: '',
      passedAway: false
    };
  }

  updateFilter(field, value) {
    this.filters = { ...this.filters, [field]: value };
  }

  togglePassedAway(e) {
    this.filters = { ...this.filters, passedAway: e.target.checked };
  }

  get filteredPeople() {
    return theNames.filter(p => {
      const fn = this.filters.firstName.toLowerCase();
      const ln = this.filters.lastName.toLowerCase();
      const bm = this.filters.birthMonth.toLowerCase();
      const bd = this.filters.birthDay;
      const by = this.filters.birthYear;
      const pa = this.filters.passedAway;

      return (
        (!fn || p.firstName.toLowerCase().startsWith(fn)) &&
        (!ln || p.lastName.toLowerCase().startsWith(ln)) &&
        (!bm || (p.birthMonth && p.birthMonth.toLowerCase() === bm)) &&
        (!bd || p.birthDay == bd) &&
        (!by || p.birthYear == by) &&
        (!pa || p.passedAway === true)
      );
    }).sort((a, b) => a.lastName.localeCompare(b.lastName));
  }

  clearFilters() {
    this.filters = {
      firstName: '',
      lastName: '',
      birthMonth: '',
      birthDay: '',
      birthYear: '',
      passedAway: false
    };
  }

  render() {
    return html`
      <div class="search-bar">
        <input placeholder="First Name" .value=${this.filters.firstName} @input=${e => this.updateFilter('firstName', e.target.value)}>
        <input placeholder="Last Name" .value=${this.filters.lastName} @input=${e => this.updateFilter('lastName', e.target.value)}>

        <select @change=${e => this.updateFilter('birthMonth', e.target.value)}>
          <option value="">-- Month --</option>
          ${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(month => html`
            <option value=${month.toLowerCase()} ?selected=${this.filters.birthMonth.toLowerCase() === month.toLowerCase()}>${month}</option>
          `)}
        </select>

        <input type="number" placeholder="Day" .value=${this.filters.birthDay} @input=${e => this.updateFilter('birthDay', e.target.value)}>
        <input type="number" placeholder="Year" .value=${this.filters.birthYear} @input=${e => this.updateFilter('birthYear', e.target.value)}>

        <label>
          <input type="checkbox" .checked=${this.filters.passedAway} @change=${this.togglePassedAway}>
          Passed Away
        </label>

        <button @click=${this.clearFilters}>Clear</button>
      </div>

      ${this.filteredPeople.map(person => html`
        <div class="person">
          <strong>${person.firstName} ${person.lastName}</strong><br>
          Born: ${person.birthMonth || '-'} ${person.birthDay || ''}, ${person.birthYear || '-'}<br>
          ${person.passedAway ? '🕊️ Passed Away' : ''}
        </div>
      `)}
    `;
  }
}

customElements.define('birthday-app', BirthdayApp);