const searchButton = document.getElementById("search-button");
const overlay = document.getElementById("model-overlay");
const movieName = document.getElementById("movie-name");
const movieYear = document.getElementById("movie-year");
const moviePoster = document.getElementById("movie-poster");
const movieListContainer = document.getElementById("movie-list");

let movieList = JSON.parse(localStorage.getItem('movieList')) ?? [];

async function searchButtonClickHandler() {
  try {
    let url = `http://www.omdbapi.com/?apikey=${APIKEY}&t=${movieNameFormaterGenerator()}${movieYearFormaterGenerator()}`;

    const response = await fetch(url);
    const data = await response.json();
    //console.log(data);
    if (data.Error) {
      throw new Error("Filme não encontrado");
    }
    createModal(data);
    overlay.classList.add("open");

    //console.log(url);
  } catch (error) {
    notie.alert({
      text: error.message,
      type: "error",
    });
    console.error();
  }
}
/*
|Função formata o texto com o nome do filme que vai ser passado por parametro no URL de requisição GET da API de filmes
|o paramente precisa separar as parte do nome do filme pelo caracter +
|para isso recuperamos o valor pelo movieName.value usando o metodo split passando como parametro o espaço
|o texte recebido e divido em dados diferente e colocado dentro de um array
|após isso aplicamos o metodo join para juntar essas informações do array cocando o caracter + para juntar as palavras*/
function movieNameFormaterGenerator() {
  if (movieName.value === "") {
    throw new Error("O nome do Filme deve ser informado");
  }
  return movieName.value.split(" ").join("+");
}

function movieYearFormaterGenerator() {
  if (movieYear.value === "") {
    return "";
  }
  if (movieYear.value.length !== 4 || Number.isNaN(Number(movieYear.value))) {
    throw new Error("Ano do filme invalido.");
  }
  return `&y=${movieYear.value}`;
}

function addToList(data) {
  if (isFilmaAlreadyOnTheList(data.imdbID)){
    notie.alert({
      text: 'Filme já está na Lista',
      type: "error",
    });

  }else{
    movieList.push(data);
    updateLocalStorage();
    updateUi(data);
    overlay.classList.remove("open");

  }

}
function removeFilmeList(imdbid){
  movieList = movieList.filter(movie => movie.imdbID !== imdbid);
  if(confirm("deseja remove o Filme da Lista?")){
    document.getElementById(`movie-card-${imdbid}`).remove();
  }
  updateLocalStorage();
  
}

function updateUi(data) {
  movieListContainer.innerHTML += `<article id='movie-card-${data.imdbID}'>
  <img src="${data.Poster}" alt="Filme ${data.Title}">
  <button class="remove-list" onclick='{removeFilmeList("${data.imdbID}")}'><i class="bi bi-trash"></i> Remover da lista</button>
</article>`;
}

function isFilmaAlreadyOnTheList(imdbid) {
  function verificarFilmeExsite(movie) {
    return movie.imdbID === imdbid;
  }
  return movieList.find(verificarFilmeExsite);
}

function updateLocalStorage(){
  localStorage.setItem('movieList',JSON.stringify(movieList));
}

movieList.forEach(updateUi);

searchButton.addEventListener("click", searchButtonClickHandler);
