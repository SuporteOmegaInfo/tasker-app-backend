async function onde(){
  mountLocations()
}

async function mountLocations(){

    let locationsData = await readJsonFile("./../assets/data/lugares.json")
    let nationalData = locationsData.filter(x => x.category == 'Nacional')
    let internationalData = locationsData.filter(x => x.category == 'Internacional')

    if(Array.isArray(locationsData)){

      let locationsRow = document.querySelector('#locations-row')
      locationsRow.innerHTML = ''

      if(locationsData.length > 0){

        //Nacional
        if(locationsRow && nationalData){

          let htmlText = ''

          let limit = nationalData.length < 18 ? nationalData.length : 18

          htmlText+=`<div class="col-12 mt-5">`
          htmlText+=`<h3>Nacional</h3>`
          htmlText+=`<hr class="w-100">`
          htmlText+=`</div>`

          //Populando serviços dentro da uma row encontrada com id services-row
          for(i = 0; i < limit ; i++){
            let location = nationalData[i]

            htmlText+='<div class="col-md-4 mt-3 location_item">'
            htmlText+=`<p class="city">${location.city}</p>`
            htmlText+=`<p class="title">${location.name}</p>`
            htmlText+=`<div class="phones">`
            for (let i = 0; i < location.phone.length; i++) {
              const element = location.phone[i];
              htmlText+=`<a href="tel:${element}">${element}</a>`
            }
            htmlText+=`</div>`
            htmlText+=`<a href="mailto:${location.email}" class="email">${location.email}</a>`
            htmlText+=`<a target="_blank" href="${location.site}" class="url">${location.site}</a>`
            htmlText+=`<a target="_blank" href="${location.map}" class="map">Mapa</a>`
            htmlText+=`</div>`
          }

          locationsRow.innerHTML = htmlText

        }

        //Internacional
        if(locationsRow && internationalData){

          let htmlText = ''

          let limit = internationalData.length < 18 ? internationalData.length : 18

          htmlText+=`<div class="col-12 mt-5">`
          htmlText+=`<h3>Internacional</h3>`
          htmlText+=`<hr class="w-100">`
          htmlText+=`</div>`

          //Populando serviços dentro da uma row encontrada com id services-row
          for(i = 0; i < limit ; i++){
            let location = internationalData[i]

            htmlText+='<div class="col-md-4 mt-3 location_item">'
            htmlText+=`<p class="city">${location.city}</p>`
            htmlText+=`<p class="title">${location.name}</p>`
            htmlText+=`<div class="phones">`
            for (let i = 0; i < location.phone.length; i++) {
              const element = location.phone[i];
              htmlText+=`<a href="tel:${element}">${element}</a>`
            }
            htmlText+=`</div>`
            htmlText+=`<a href="mailto:${location.email}" class="email">${location.email}</a>`
            htmlText+=`<a target="_blank" href="${location.site}" class="url">${location.site}</a>`
            htmlText+=`<a target="_blank" href="${location.map}" class="map">Mapa</a>`
            htmlText+=`</div>`
          }

          locationsRow.innerHTML += htmlText

        }
      }
    }else{
      console.error('Locations must be an Array.')
    }
}

async function readJsonFile(path){
    try {
        return await fetch(path).then((response) => response.json())
        .then((json) => {return json});
    } catch (error) {
        console.log(error)
    }
}

window.addEventListener('load', onde);
