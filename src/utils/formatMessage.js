function formatMessage(user, text, type = "normal") {
  const time = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    user,
    text,
    time,
    type, 
  };
}