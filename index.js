let searchBarInput = document.getElementById("search-bar-input")
let searchBarImg = document.getElementById("search-bar-img")
let mainContentWord = document.getElementById("main-content-word")
let mainContentIPA = document.getElementById("main-content-IPA")
let mainContentNounMeaningList = document.getElementById("main-content-noun-meaning-list")
let mainContentVerbMeaningList = document.getElementById("main-content-verb-meaning-list")
let mainContentVerbMeaningListExample = document.getElementById("main-content-verb-meaning-list-example")
let sourceLink = document.getElementById("source-link-wrapper")
let mainContentPlay = document.getElementById("main-content-play")
let playBtn = document.getElementById("play-btn")
let selectFont = document.getElementById("select-font")
let nounMeanings = ''
let verbMeanings = ''
let synonyms = document.getElementById("main-content-synonyms")
let synonymsData = ''
let verbExample = ''
let hasNounMeanings = false
let hasVerbMeanings = false
let phoneticsAudio = ''
let mainContent = document.getElementById("main-content")
let optionsBar = document.getElementById("options-bar")

mainContent.classList.add("hidden")
optionsBar.style.marginTop = "40%"

function reset(){
    mainContent.classList.remove("hidden")
    optionsBar.style.marginTop = "2rem"

    document.getElementById("audio").src=``
    nounMeanings = ''
    verbMeanings = ''
    verbExample = ''
    hasNounMeanings = false
    hasVerbMeanings = false
    phoneticsAudio = ''
}

function setMainContentWord(data){
    //set main-content-word to data[0].word
    mainContentWord.textContent = data[0].word
}
function setMainContentIPA(data){
    //set main-content-IPA to data[0].phonetics[1] (this has audio file too)
    mainContentIPA.textContent = data[0].phonetics[0].text
}
function setMainContentNoun(data){
    for(let i = 0; i < data[0].meanings.length; i++){
        if(data[0].meanings[i].partOfSpeech == "noun"){
            for(let j = 0; j < data[0].meanings[i].definitions.length; j++){
                nounMeanings += `<li>${data[0].meanings[i].definitions[j].definition}</li>`
            }
            hasNounMeanings = true
        }
        else{
            hasNounMeanings = false
        }
    }
}
function setMainContentVerb(data){
    for(let i = 0; i < data[0].meanings.length; i++){
        if(data[0].meanings[i].partOfSpeech == "verb"){
            verbMeanings = ''
            verbExample = ''
            for(let j = 0; j < data[0].meanings[i].definitions.length; j++){
                verbMeanings += `<li>${data[0].meanings[i].definitions[j].definition}</li>`
                if(data[0].meanings[i].definitions[j].example){
                    verbExample = `"${data[0].meanings[i].definitions[j].example}"`
                }
                
            }
            hasVerbMeanings = true
        }else{
            hasVerbMeanings = false
        }
        
    }
}

function setVerbExample(){
    if(hasVerbMeanings == false){
        verbMeanings = `<li>no verb meanings</li>`
    }
}

function renderHTML(){
    mainContentNounMeaningList.innerHTML = nounMeanings
    mainContentVerbMeaningList.innerHTML = verbMeanings
    mainContentVerbMeaningListExample.textContent = verbExample
    document.getElementById("main-content-verb-meaning-list-example").textContent = verbExample
}

function setPhoneticsAudio(data){
    phoneticsAudio = ''
    for(let i = 0; i < data[0].phonetics.length; i++){
        if(data[0].phonetics[i].audio != ''){
            phoneticsAudio = data[0].phonetics[i].audio
        }
    }
    document.getElementById("audio").src=`${phoneticsAudio}`
}

function setSourceLink(data){
    sourceLink.innerHTML = `
    <a class="source-link" href="${data[0].sourceUrls[0]}">${data[0].sourceUrls[0]}</a>
    <img src="./assets/images/icon-new-window.svg" alt="" >
    `
}

function setSynonyms(data){
    for(let i = 0; i < data[0].meanings.length; i++){
        if(data[0].meanings[i].partOfSpeech == "noun"){
            for(let j = 0; j < data[0].meanings[i].definitions.length; j++){
                //data[0].meanings[i].synonyms[j].length > 0
                if(data[0].meanings[i].synonyms[j]){
                    // add to inner html with class of hidden, when clicking synonym word hide verb/verb meaning and display synonyms. synonyms button should turn into verb button and should click on verb button to hide synonyms and display verbs
                    synonymsData += `
                    <li>${data[0].meanings[i].synonyms[j]}</li>
                    `
                }
            }  
        }
    }
}

function fetchDictionaryData(){
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchBarInput.value}`)
    .then(res => res.json())
    .then(data => {
        reset()
        setMainContentWord(data)
        setMainContentIPA(data)
        setMainContentNoun(data)
        setSynonyms(data)
        setMainContentVerb(data)
        setPhoneticsAudio(data)
        setVerbExample()
        renderHTML()
        setSourceLink(data)

    })
    
}

searchBarInput.addEventListener("change", function(){
    fetchDictionaryData()

    
})

playBtn.addEventListener("click",function(){
        
    if(document.getElementById("audio").play() !== undefined){
        document.getElementById("audio").play().then(function(){})
        .catch(function(error) {
            
          });
    }

})

synonyms.addEventListener("click", function(){
    if(synonyms.textContent == "Synonyms"){
        synonyms.textContent = "Verbs"
        document.getElementById("main-content-verb").textContent = "synonyms"
        document.getElementById("main-content-verb-meaning").textContent = ''
        document.getElementById("main-content-verb-meaning-list").innerHTML = synonymsData
        
    }else if(synonyms.textContent == "Verbs"){
        synonyms.textContent = "Synonyms"
        document.getElementById("main-content-verb").textContent = "Verbs"
        document.getElementById("main-content-verb-meaning").textContent = 'Meaning'
        document.getElementById("main-content-verb-meaning-list").innerHTML = verbMeanings
    }
})

selectFont.addEventListener("change", function(){
    console.log(selectFont.value)
    if(selectFont.value == "sans-serif"){
        document.body.style.fontFamily = "sans-serif"
    }
    if(selectFont.value == "serif"){
        document.body.style.fontFamily = "serif"
    }
    if(selectFont.value == "mono"){
        document.body.style.fontFamily = "monospace"
    }
})


// synonyms.addEventListener("click", function(){
//     if(synonyms.textContent == "Synonyms"){
//         synonyms.textContent = "Verbs"
//         document.getElementById("main-content-verb").textContent = "synonyms"
//         document.getElementById("main-content-verb-meaning").textContent = ''
//         document.getElementById("main-content-verb-meaning-list").innerHTML = synonymsData
//     }
//     if(synonyms.textContent == "Verbs"){

//     }
// })