async function services(){

  let inputSearch = document.getElementById('input-search-service-name')
  let btnInputSearch = document.getElementById('clear-page-search-button')
  const urlParams = new URLSearchParams(window.location.search)

  const name = urlParams.get('name');
  const description = urlParams.get('description');

  mountServices({name, description})

  if(inputSearch){
    inputSearch.addEventListener('change', (evt) => {
      //console.log(evt.target.value)
      let value = evt.target.value

      if(value != ''){
        btnInputSearch.style.display = 'block'
      }

      mountServices({
        name: value,
        description: value
      })
    })
  }

  if(btnInputSearch){
    btnInputSearch.addEventListener('click', () => {
      inputSearch.value = ''
      btnInputSearch.style.display = 'none'
      mountServices()
    })
  }
}

/*
Padrão [NOVO] de Html dos Cards dos Serviços

<div class="col-md-3 my-3">
  <div class="catalog_item">
    <figure style="background-image: url('./assets/images/services/product_1.webp');">
      <a href="#">Nome do Serviço</a>
    </figure>
  </div>
</div>

Padrão [ANTIGO] de Html dos Cards dos Serviços

<div id="services-row" class="row">
    <div class="col-md-4">
        <div class="card fixed-card">
        <figure class="card-figure" style="background-image: url('./assets/images/house1.webp');"></figure>
        <div class="card-title p-2">
            <h3>Serviço Primeiro</h3>
        </div>
        <hr class="w-100">
        <div class="card-detail p-2">
            <p class="mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec diam velit</p>
        </div>
        <hr class="w-100">
        <div class="card-footer px-2">
            <a class="card-link mt-3" href="#">Saiba mais</a>
        </div>
        </div>
    </div>
    <div class="col-12 py-5">
        <a class="btn-bottom-section p-2" href="/servicos">Ver todos os serviços</a>
    </div>
</div>


*/
async function mountServices(filters = null){

    let serviceData = await readJsonFile("./../assets/data/servicos.json")

    if(Array.isArray(serviceData)){
      let keys = Object.keys(filters)
      keys.map(key => {
        if(filters[key] && filters[key] != ''){
          serviceData = serviceData.filter(x => {
            return x[key] && x[key].indexOf(filters[key]) >= 0
          })
        }
      })
      let servicesPageRow = document.querySelector('#services-page-row')
      let servicesGallery = document.querySelector('#image-gallery')

      if(serviceData.length > 0){
        if(servicesPageRow){

          servicesPageRow.innerHTML = ''

          let htmlText = ''

          let limit = serviceData.length < 18 ? serviceData.length : 18

          //Populando serviços dentro da uma row encontrada com id services-row
          for(i = 0; i < limit ; i++){

              let service = serviceData[i]

              htmlText+='<div class="col-md-3 my-3">'
              htmlText+='<div class="catalog_item">'
              htmlText+=`<figure style="background-image: url('${service.image}');">`
              htmlText+=`<a href="${service.slug}.html">${service.name}</a>`
              htmlText+=`</figure>`
              htmlText+='</div>'
              htmlText+='</div>'

          }

          servicesPageRow.innerHTML = htmlText

        }
        if(servicesGallery){

            let currentService = window.location.pathname.replace('/','').replace('.html','');
            currentService = serviceData.find(x => x.slug = currentService)

            await Promise.all(

                currentService.gallery.map(async (d, i) => {
                    //Criando o Item
                    let galleryItem = document.createElement('div')
                    galleryItem.classList.add('gallery_item')

                    //Criando input Radio
                    let inp = document.createElement('input')
                    inp.type = 'radio'
                    inp.id = `img-${i}`
                    inp.name = 'gallery'
                    inp.classList.add('gallery_selector')
                    inp.checked = true
                    galleryItem.append(inp)

                    //Criando gallery_img
                    let gimg = document.createElement('img')
                    gimg.classList.add('gallery_img')
                    gimg.src = d
                    galleryItem.append(gimg)

                    //Criando label da Thumb
                    let lb = document.createElement('label')
                    lb.setAttribute('for', `img-${i}`)
                    lb.classList.add('gallery_thumb')
                    let limg = document.createElement('img')
                    limg.src = d
                    lb.append(limg)
                    galleryItem.append(lb)

                    //Finalizando importação
                    servicesGallery.append(galleryItem)
                })
            )
        }
      }
    }else{
      console.error('Services must be an Array.')
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

window.addEventListener('load', services);
