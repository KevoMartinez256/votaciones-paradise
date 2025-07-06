async function votar() {
  const username = document.getElementById("username").value.trim();
  const candidato = document.getElementById("candidato").value;

  const response = await fetch("/guardar-voto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, candidato })
  });

  const data = await response.json();
  document.getElementById("mensaje").innerText = data.message;
}