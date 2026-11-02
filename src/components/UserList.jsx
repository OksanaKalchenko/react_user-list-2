import { useState } from "react";

const initialUsers = [
  { id: 1, name: "Creola Katherine Johnson", profession: "Mathematician" },
  { id: 2, name: "Mario José Molina-Pasquel Henríquez", profession: "Chemist" },
  { id: 3, name: "Mohammad Abdus Salam", profession: "Physicist" },
  { id: 4, name: "Percy Lavon Julian", profession: "Chemist" },
  { id: 5, name: "Katherine Johnson", profession: "Programmer" },
  { id: 6, name: "Jane Johnson", profession: "Astronaut" },
  { id: 7, name: "Cael Thas", profession: "Manager" },
];

export default function UserList() {
  const [users, setUsers] = useState(initialUsers);
  const [selectedProfession, setSelectedProfession] = useState("");
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [sortField, setSortField] = useState("name");
  const [errors, setErrors] = useState({});

  const professions = [...new Set(users.map((user) => user.profession))];
  const sortFields = Object.keys(users[0]).filter((key) => key !== "id");

  const sortFieldLabels = {
    name: "Имя",
    profession: "Профессия",
  };

  const filteredUsers = selectedProfession
    ? users.filter((user) => user.profession === selectedProfession)
    : users;

  function sortUsers() {
    const sortedUsers = [...users].sort((a, b) =>
      String(a[sortField] ?? "").localeCompare(
        String(b[sortField] ?? ""),
        "en",
      ),
    );

    setUsers(sortedUsers);
  }

  function validateForm() {
    const newErrors = {};
    const trimmedName = name.trim();
    const trimmedProfession = profession.trim();

    const regularExpression = /^[A-Za-z -]+$/;

    if (!trimmedName) {
      newErrors.name = "Имя не может быть пустым";
    } else if (trimmedName.length < 2 || trimmedName.length > 40) {
      newErrors.name = "Имя должно быть от 2 до 40 символов";
    } else if (!regularExpression.test(trimmedName)) {
      newErrors.name = "Разрешена только латиница без цифр и спецсимволов";
    }

    if (!trimmedProfession) {
      newErrors.profession = "Профессия не может быть пустой";
    } else if (trimmedProfession.length < 5 || trimmedProfession.length > 100) {
      newErrors.profession = "Профессия должна быть от 5 до 100 символов";
    } else if (!regularExpression.test(trimmedProfession)) {
      newErrors.profession =
        "Разрешена только латиница без цифр и спецсимволов";
    }

    setErrors(newErrors);

    return !newErrors.name && !newErrors.profession;
  }

  function createUser(evt) {
    evt.preventDefault();

    if (!validateForm()) return;

    const newUser = {
      id: users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1,
      name,
      profession,
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
    setName("");
    setProfession("");
    setErrors({});
  }

  return (
    <div className="content">
      <h1 className="content__title">Список пользователей</h1>
      <form className="user__form" onSubmit={createUser}>
        <h2 className="form__title">Создать пользователя</h2>
        <div className="form__fields">
          <div className="form__field">
            <label htmlFor="user-name">Имя</label>
            <input
              type="text"
              className={
                errors.name ? "form__input error__input" : "form__input"
              }
              id="user-name"
              placeholder="Введите имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
          <div className="form__field">
            <label htmlFor="user-profession">Профессия</label>
            <input
              type="text"
              className={
                errors.profession ? "form__input error__input" : "form__input"
              }
              id="user-profession"
              placeholder="Введите профессию"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
            />
            {errors.profession && <p className="error">{errors.profession}</p>}
          </div>
        </div>

        <button type="submit" className="form__btn">
          Создать
        </button>
      </form>

      <div className="filter">
        <div className="filter__section">
          <h3 className="filter__title">Фильтр по профессии</h3>
          <div className="filter__buttons">
            <button
              className={`filter__btn profession-btn ${
                selectedProfession === "Chemist" ? "active" : ""
              }`}
              onClick={() => setSelectedProfession("Chemist")}
            >
              Показать только химиков
            </button>
            <button
              className="filter__btn reset-btn"
              onClick={() => setSelectedProfession("")}
            >
              Сбросить фильтр
            </button>
          </div>
        </div>
        <div className="filter__section">
          <h3 className="filter__title">Все профессии</h3>
          <select
            className="select select__professions"
            value={selectedProfession}
            onChange={(evt) => setSelectedProfession(evt.target.value)}
          >
            <option value="">Все профессии</option>

            {professions.map((profession) => (
              <option key={profession} value={profession}>
                {profession}
              </option>
            ))}
          </select>
        </div>
        <div className="filter__section">
          <h3 className="filter__title">Сортировка</h3>
          <div className="sort__container">
            <select
              className="select select__field"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              {sortFields.map((field) => (
                <option key={field} value={field}>
                  {sortFieldLabels[field] || field}
                </option>
              ))}
            </select>
            <button className="sort__btn" type="button" onClick={sortUsers}>
              Сортировать
            </button>
          </div>
        </div>
      </div>
      <div className="user__list-container">
        <p className="user__list-quantity">
          Пользователи {`(${filteredUsers.length})`}
        </p>
        <ul className="user__list">
          {filteredUsers.map((user) => (
            <li key={user.id} className="user__list-item">
              <p className="user__name">{user.name}</p>
              <p className="user__profession">{user.profession}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
