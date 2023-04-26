"use client";
import { useState, useEffect, use } from "react";
import Router from "next/router";
const cards = "2,3,4,5,6,7,8,9,10,2,3,4,5,6,7,8,9,J,Q,K".split(",");

export default function Home() {
  let [hand, setHand] = useState(generate_start_cards());
  let [dealerHand, setDealerHand] = useState([...[generate_start_cards(1), ...["Rev"]]]);
  let dealerScore = 0;
  let [userhide, setUserHide] = useState(false);
  let score: any = 0;
  let [end_turn,setEndTurn] = useState(false)
  function CheckScores() {
    var message = ""
    if (end_turn) {
      if (score == 21 && dealerScore == 21 || score > 21 && dealerScore > 21 || score == dealerScore) {
        message = "Tie"
        console.log("%cTie", "color:red; font-size: x-large");
      } else if (score > dealerScore && score < 21 && dealerScore < 21 || score == 21 && dealerScore < 21 || dealerScore > 21 && score < 21 || score == 21 && dealerScore != 21) {
        message = "User Wins"
        console.log("%cUser Wins", "color:red; font-size: x-large");
      } else if (score < dealerScore && score < 21 && dealerScore < 21 || dealerScore == 21 && score < 21 || score > 21 && dealerScore < 21 || dealerScore == 21 && score != 21) {
        message = "Dealer Wins"
        console.log("%cDealer Wins", "color:red; font-size: x-large");
      }
      return (
        <div className="final_score">
            <div>
              <h1 className="final-message">{message}</h1>
              <button onClick={() => Router.reload()} className="px-6 py-2 bg-lime-500 font-semibold rounded-full border-round border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-lime-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 retryButton">Play Again</button>
            </div>
          </div>
      )
    }
    return (
      <br />
    )
  }

  useEffect(() => {
    dealerTakeCards();
    
  }, [dealerHand, dealerScore, userhide]);

  const dealerTakeCards = () => {
    if (dealerScore < 16 && userhide == true) {
      setDealerHand((prevDealerHand) => [...prevDealerHand, ...[generate_card()]]);
      dealerScore = dealerHand.filter(x => x != "Rev")
        .map((x) => ((x == "J" || x == "K" || x == "Q") ? (x = "10") : (x = x)))
        .map((x:any) => parseInt(x))
        .reduce((a, b) => {
          return a + b;
        });
    } else if (dealerScore >= 16 && userhide == true) {
      setEndTurn(true)
    }
  };
  function User() {
    
    score = hand
      .map((x) => (x == "J" || x == "K" || x == "Q" ? (x = "10") : (x = x)))
      .map((x) => parseInt(x))
      .reduce((a, b) => {
        return a + b;
      });

    function Hit() {
      setHand([...hand, ...[generate_card()]]);
    }

    function Stand() {
      
      if (dealerHand.includes("Rev")) {
        setDealerHand(dealerHand.filter(x => x != "Rev"))
      }
      setUserHide(true);
    }
    var ca = hand.map(x => (
      "/images/cards/card"+x+".svg"
    ))
    if (score >21) {
      Stand()
    }
    return (
      <div>
        <div>
          <h1 suppressHydrationWarning>Score: {score}</h1>
        </div>
        <div className="cards-box">
          {ca.map((x,index) => (
            <img key={index} src={x} suppressHydrationWarning/>
          ))}
        </div> <br />
          <div className="user-buttons container mx-auto">
            {!userhide && <button onClick={Hit} className="px-6 py-1 bg-lime-500 font-semibold rounded-full border-round border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-lime-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Hit</button>}<br />
            {!userhide && <button onClick={Stand} className="px-4 py-1 bg-lime-500 font-semibold rounded-full border-round border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-lime-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Stand</button>}
          </div>
        </div>
    );
  }

  function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  function generate_card() {
    return cards[getRandomNumber(0, cards.length)];
  }
  function generate_start_cards(nCards:number = 2) {
    var selected_cards = [];
    for (let i = 0; i < nCards; i++) {
      selected_cards.push(cards[getRandomNumber(0, cards.length)]);
    }
    return selected_cards;
  }
  
  function DealerCards() {
    
    dealerScore = dealerHand.filter(x => x != "Rev")
      .map((x) => (x == "J" || x == "K" || x == "Q" ? (x = "10") : (x = x)))
      .map((x:any) => parseInt(x))
      .reduce((a, b) => {
        return a + b;
      });
    
    return (
      <div>
      <div>
        <h1 suppressHydrationWarning>
          Dealer Score: {dealerScore}
        </h1>
      </div>
      <div className="cards-box">
        {dealerHand.map((x, index) => (
          <img
            key={index}
            src={"/images/cards/card" + x + ".svg"}
            suppressHydrationWarning
          />
        ))}
      </div>{" "}
      <br />
    </div>
    );
  }
  
  return (
    <div className="table">
      <DealerCards />
      <User />
      <div>
        <CheckScores />
      </div>
      
    </div>
  );
}
