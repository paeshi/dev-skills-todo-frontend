import { useState, useEffect } from "react";
import "./styles.css";
import Header from "./components/Header/Header";
import { auth } from "./services/firebase";

export default function App() {
  const [state, setState] = useState({
    user: null,
    skills: [],
    newSkill: {
      skill: "",
      level: "3",
    },
    editMode: false,
  });

  async function getAppData() {
    if (!state.user) return;
    try {
      const BASE_URL = `https://dev-skills-todo-app.herokuapp.com/skills?uid=${state.user.uid}`;
      const skills = await fetch(BASE_URL).then((res) => res.json());
      setState((prevState) => ({
        ...prevState,
        skills,
      }));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAppData();
    const cancelSubscription = auth.onAuthStateChanged((user) => {
      if (user) {
        setState((prevState) => ({
          ...prevState,
          user,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          skills: [],
          user,
        }));
      }
    });
    return function () {
      //cleanup function
      cancelSubscription();
    };
  }, [state.user]);

  async function handleSubmit(e) {
    // this statement exits for safety:
    if (!state.user) return;
    e.preventDefault();

    const BASE_URL = "https://dev-skills-todo-app.herokuapp.com/skills";

    if (!state.editMode) {
      const skills = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify({ ...state.newSkill, uid: state.user.uid }),
      }).then((res) => res.json());

      setState((prevState) => ({
        ...prevState,
        skills,
        newSkill: {
          skill: "",
          level: "3",
        },
      }));
    } else {
      const { skill, level, _id } = state.newSkill;
      const skills = await fetch(`${BASE_URL}/${_id}`, {
        method: "PUT",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify({ skill, level }),
      }).then((res) => res.json());

      setState((prevState) => ({
        ...prevState,
        skills,
        newSkill: {
          skill: "",
          level: "3",
        },
        editMode: false,
      }));
    }
  }
  function handleChange(e) {
    setState((prevState) => ({
      ...prevState,
      newSkill: {
        ...prevState.newSkill,
        [e.target.name]: e.target.value,
      },
    }));
  }
  async function handleDelete(skillId) {
    if (!state.user) return;
    const URL = `https://dev-skills-todo-app.herokuapp.com/api/skills/${skillId}`;
    const skills = await fetch(URL, {
      method: "DELETE",
    }).then((res) => res.json());

    setState((prevState) => ({
      ...prevState,
      skills,
    }));
  }

  function handleEdit(skillId) {
    const { skill, level, _id } = state.skills.find(
      (skill) => skill._id === skillId
    );
    setState((prevState) => ({
      ...prevState,
      newSkill: {
        skill,
        level,
        _id,
      },
      editMode: true,
    }));
  }

  function handleCancel() {
    setState((prevState) => ({
      ...prevState,
      newSkill: {
        skill: "",
        level: "3",
      },
      editMode: false,
    }));
  }

  return (
    <>
      <Header user={state.user} />
      <main>
        <section>
          {state.skills.map((s, index) => (
            <article key={index}>
              <div>{s.skill}</div>
              <div>{s.level}</div>
              <div onClick={() => handleDelete(s._id)}>{"🗑"}</div>
              {!state.editMode && (
                <div onClick={() => handleEdit(s._id)}>{"✏️"}</div>
              )}
            </article>
          ))}

          {state.user && (
            <>
              <hr />
              <form onSubmit={handleSubmit}>
                <label>
                  <span>SKILL</span>
                  <input
                    name="skill"
                    value={state.newSkill.skill}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>LEVEL</span>
                  <select
                    name="level"
                    value={state.newSkill.level}
                    onChange={handleChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </label>
                <button>{state.editMode ? "Edit Skill" : "Add Skill"}</button>
              </form>
              {state.editMode && <button onClick={handleCancel}>Cancel</button>}
            </>
          )}
        </section>
      </main>
    </>
  );
}
