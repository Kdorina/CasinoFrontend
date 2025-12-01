import React from "react";

export default function BotChat({ messages }) {
  return (
    <div className="bot-chat">
      <h3>Chat</h3>
      <div className="chat-window">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.from === "system"
                ? "chat-msg system"
                : m.from === "Other Player"
                ? "chat-msg bot"
                : "chat-msg you"
            }
          >
            {m.from !== "system" && (
              <span className="author">
                {m.from === "Other Player" ? "Other Player" : "Te"}:
              </span>
            )}
            <span className="text">{m.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
