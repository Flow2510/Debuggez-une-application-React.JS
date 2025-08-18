import { useEffect, useRef, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  );

  const timeOut = useRef(null);               // La propriété .current est mutable : tu peux la lire et la modifier. Contrairement à useState, changer ne provoque pas de re-render.

  const nextCard = () => {
    if (!Array.isArray(byDateDesc)) return;  // verifie que bydatedesc est la, si elle est pas la, la boucle reprend dans 5s voir si elle est la
    timeOut.current = setTimeout(
      () => setIndex(index < byDateDesc.length - 1 ? index + 1 : 0),  // ajout de -1 a lenght
      5000
    );
  };

  useEffect(() => {
    nextCard();
    return () => clearTimeout(timeOut.current);
  });

  const changeSlide = (idx) => {
    clearTimeout(timeOut);
    setIndex(idx);
  }

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => ( 
        <div key={event.title}>
          <div
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((e, radioIdx) => (    // ajout de e a la place de _ pour allez chercher une key unique
                <input
                  key={e.description}
                  type="radio"
                  name={`radio-button${idx}`}      // ajout de ${idx} pour avoir un nom unique pour chaque slide (conflit entre react et le navigateur)
                  checked={index === radioIdx}
                  onChange={() => changeSlide(radioIdx)}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;