
<script>
  import { Server as S } from "../../_modules/ws_normal.js";
  import { sfx, all, ins_, upd_, del, makeObject, nullFirstarrayFix, getToneName, product_img_url  } from "../../_modules/functions.js";
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import flatpickr from 'flatpickr';
  import SubmitButton from '../_SubmitButton.svelte'
  import CancelButton from '../_CancelButton.svelte';
  import ToneGroup from './_ToneGroup.svelte'
  const dp = createEventDispatcher();

  export let rowIdx = 0;
  export let item = [];
  export let hs = [];
  export let event = "ins"

  let isSaving = false;
  let er = "";  
  let date = null;
  let form = {
    title: "",
    name: "",
    date: "",
    tags_name: "",
    p_purchase_note: "",
    menu_order: 0,
    comment_status: true,
    status: "published",
    type: "product",
    visibility: "public",
    password: "",
    p_product_type: "simple",
    p_virtual: false,
    p_downloadable: false,
    p_sku: "",
    p_min_price: 0,
    p_max_price: 0,
    p_weight: 0,
    p_volume: 0,
    p_length: 0,
    p_width: 0,
    p_purity_id: 0,
    p_tone_id: 0,
    p_height: 0,
    p_shipping_class_id: 0,
    p_catalog_visibility: "shop & search results",
    p_featured: true,
    p_manage_stock: true,
    p_stock_quantity: 0,
    p_backorders: "do not allow",
    p_low_stock_amount: 2,
    p_stock_status: "instock",
    p_sold_individually: false,
    content: "",
    excerpt: "",
    pc_category_id: [],
    p_tones_tone_id: [],
    p_clarity_clarity_id: [],
    p_purities_purity_id: [],
    p_attachments_attachement_id: [], //ID, ToneId, TempId, main image
    p_making_charges: 0,
    p_discount_per: 0,
    p_cs_total_p_cs_total: [[]], //[[pcs, weight, price]]
    p_d_size_diamond_size_id: [],
    p_cs_size_cs_size_id: [],
    p_certified_by_certified_by: [],
    p_policy_post_policy: [],
  };

  $: attachment_p_tones_tone_ids = form.p_attachments_attachement_id.map(x=>x[1])

  let shipping_class = [];
  let pc_category_id = [];
  let p_tones_tone_id = [];
  let p_clarity_clarity_id = [];
  let p_purities_purity_id = [];
  let p_d_size_diamond_size_id = [];
  let p_cs_size_cs_size_id = [];
  let p_certified_by_certified_by = []
  let p_policy_post_policy = []

  let thumbnails= [];

  let setting_type_id = [];
  let shapes = [];
  let d_colors = [];
  let cs_colors = [];
  let cs_types = [];
  let sizes = [];

  const fns = [];
  let purity_new_id  = [];
  let clarity_new_id  = [];
  let purity_idx = 0;
  
  $: form.p_purity_id = p_purities_purity_id[purity_idx] ? p_purities_purity_id[purity_idx][0] : form.p_purity_id
  $: tone_selected = p_purities_purity_id[purity_idx] ? p_purities_purity_id[purity_idx][7] : [] 
  if (item.length) {
    form = makeObject(hs, item)
    form.tags_name = form.tags_name.join(" ");      
    setPasswordDisabled(); /* take care*/ setManageStock(); /* take care*/
    form.p_d_size_diamond_size_id.forEach(x=> {if(x[6] == null) {x[6] = []; }  } )
    form.p_cs_size_cs_size_id.forEach(x=> {if(x[7] == null) {x[6] = []; }  } )

  }
  const evt_type = event == "ins" && item.length == 0 && !form.id ? 1 : 2
  const save_ = evt_type == 1 ? ins_ : upd_

  fns.push(save_("product", rowIdx)); S.bind$(fns.i(-1), ([d]) => {isSaving = false; if (d.ok) {  er = ""; dp("successSave", { rowIdx, d }); } else { er = d.error; } }, 1);
  fns.push(del("product", rowIdx)); S.bind$(fns.i(-1), ([d]) => { isSaving = false; if (d.ok) {  er = ""; dp("deleteRow", { rowIdx, d }); } else { er = d.error; } }, 1);

  const batch1 = []
  batch1.push([
    all("shipping_class", rowIdx), ([d]) => { shipping_class = [[0, "No Shipping Class"], ...d]; form.p_shipping_class_id = item.length ? form["p_shipping_class_id"] : (shipping_class[0] ? shipping_class[0][0] : 0) },
    [[]]
  ]);
  batch1.push([
    ["product", "categorytreedata", sfx(rowIdx)], ([d]) => { pc_category_id = d; form.pc_category_id = item.length ? nullFirstarrayFix(form["pc_category_id"]) : [] },
    [[]]
  ]);

  
  batch1.push([
    all("tone", rowIdx), ([d]) => { p_tones_tone_id = d; form.p_tones_tone_id = item.length ? form["p_tones_tone_id"] : [] }, [[]]
  ])
  batch1.push([
    all("certified_by", rowIdx), ([d]) => { p_certified_by_certified_by = d; form.p_certified_by_certified_by = item.length ? form["p_certified_by_certified_by"] : [] }, [[]]
  ])
  batch1.push([
    all("policy", rowIdx), ([d]) => { p_policy_post_policy = d; form.p_policy_post_policy = item.length ? form["p_policy_post_policy"] : [] }, [[]]
  ])
  batch1.push([
    all("clarity", rowIdx), ([d]) => {
      p_clarity_clarity_id = d; 
      form.p_clarity_clarity_id = item.length ? form["p_clarity_clarity_id"] : [] 
      clarity_new_id = Array.from(d, (_, i)=>{
      for (const it of form.p_clarity_clarity_id) {
        if(it && it[0] === d[i][0]){
          return it
        }
      }
      return [d[i][0], 0, 0, 0, false] // clarity, pcs, weight, price, isMain
      });
    }, [[]]
  ]);
  batch1.push([
    all("purity", rowIdx), ([d]) => { 
    p_purities_purity_id = d; // This contain all the rows.
    form.p_purities_purity_id = item.length ? form["p_purities_purity_id"] : [];
    form.p_purity_id = item.length && form["p_purity_id"] ? form["p_purity_id"] : (d[0] ? d[0][0] : 0)
    if(item.length){ purity_idx = d.findIndex(v => v[0] == form.p_purity_id) }
    if(!item.length){
      if(d[0][7][0] && d[0][7][0][0]){
        form.p_tone_id = d[0][7][0][0]
      } else if(d[0][7].length > 2){
        form.p_tone_id = d[0][7][1][0]
      } else {
        form.p_tone_id = 0
      }
    }
    purity_new_id = Array.from(d, (_, i)=>{
      for (const it of form.p_purities_purity_id) {
        if(it && d[i][0] === it[0]){
          if(!it[1]) it[1] = [] // bind arry
          //all:
          const allTones = d[i][7]
          const selectedTones = it[1]
          it[3] = Array.from(allTones, (t, _)=>{
            for (const it1 of selectedTones) {
              if(it1 &&  t[0] === it1[0]){
                  return it1               
                }
            }
            return [t[0], 0, 0, false]
          })
      
          return it
        }
      }
      const all = []
      d[i][7].forEach((x)=>{
          if(x[0]){
            all.push([x[0], 0, 0, false])
          }
      })
      return [d[i][0], [], false, all] // purity, required[], all[]
    });
    updateVolume()
    }, [[], [0]]
  ]);

  batch1.push([
    all("setting_type", rowIdx), ([d]) => { setting_type_id = [[0, "No Setting Type"], ...d];; }, [[]]
  ]);
  
  const size_ = () => {form.p_d_size_diamond_size_id = form.p_d_size_diamond_size_id}

  batch1.push([ all("shape", rowIdx), ([d]) => { shapes = d; size_()}, [[]]  ])
  batch1.push([ all("d_color", rowIdx), ([d]) => { d_colors = d; size_()}, [[]]  ])
  batch1.push([ all("cs_color", rowIdx), ([d]) => { cs_colors = d; size_()}, [[]]  ])
  batch1.push([ all("cs_type", rowIdx), ([d]) => { cs_types = d; size_()}, [[]]  ])
  batch1.push([ all("size", rowIdx), ([d]) => { sizes = d; size_()}, [[], [0]]  ])
  S.batchBind_T(batch1)
  
  /*
  // request thumnails with websocket:
  for (let i = 0; i < form.p_attachments_attachement_id.length; i++) {
    const e = form.p_attachments_attachement_id[i];
    if(!e[1]) continue;
    
    S.bind_(["product", "attachment_data", sfx(rowIdx + i + e[0])], (data) => {
      // thumbnails[i] = new Blob([data])
    if(data instanceof Blob){
      const url = URL.createObjectURL(data)
      thumbnails[i] = url
    }
    }, e[0]);
  }
  */
  form.p_attachments_attachement_id.map((x, i) => thumbnails[i] = `${product_img_url}/${x[0]}/${x[4]}`)
 
  onMount(async () => {
    // setup date:
    const elem = date
    const defaultDate = form.date || (new Date()).toISOString();
    form.date = defaultDate;
    flatpickr(elem, {
          altInput: true,
          altFormat: "F j, Y G:i K",
          //dateFormat: "Y-m-d",
          //allowInput: true,
          enableTime: true,
          defaultDate,
          onChange: (selectedDates, dateStr, instance) => {
            form.date = selectedDates[0].toISOString()
          }
    })
  onDestroy(() => { if(process.browser) S.unbind_(fns) });
    
   ///// const {default: tinymce} = await import('tinymce');
    // setup Product Detail:
    // relative_urls: false, remove_script_host : 0, document_base_url: 'http://www.tinymce.com/tryit/', 
    // skin_url: '../admin/skins/content/default',
   
    ////tinyMCE.baseURL = "../admin";
    // const theme_url =   ('/admin/themes/silver/theme.js').replace("\/\/", "\/")
    // const skin_url =   ('/admin/skins/content/default').replace("\/\/", "\/")
     if (window.hasOwnProperty("tinymce")) {
      tinymce.init({ plugins: 'link image code', selector: '.tinymce_p_content', forced_root_block: false, setup: function (e) { e.on('change', () => { e.save(); form.content = e.getContent() }); } })
      tinymce.init({ plugins: 'link image code', selector: '.tinymce_p_excerpt', forced_root_block: false, setup: function (e) { e.on('change', () => { e.save(); form.excerpt = e.getContent() }); } })
     }
  });
  onDestroy(() => { if(process.browser) S.unbind_(fns) });
  
  
  async function save() {if(!form.pc_category_id.length) {alert("Please Select Category"); return;} isSaving = true; S.trigger([[ save_("product", rowIdx), [form, [form.id]] ]]); }
  function clearError() { er = ""; }

  async function deleteRow() { isSaving = true; S.trigger( [[ del("product", rowIdx), [form.id] ]] ); }
  // ------------
  function setPasswordDisabled() { if (form.visibility != "password protected") { form.password = ""; } }
  function setManageStock() { if (!form.p_manage_stock) { form.p_stock_quantity = 0; /*form.p_backorders = "do not allow"*/ } }

  let parcentage = 0;
  const handleFileChange = (row) => (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile.type.startsWith('image/')){ 
      alert("Please Select Image File Only")
      return
    }
    //const per_change = (n) =>  parcentage = n
    const percentage_change = (bytesNotSent) => {
      if(bytesNotSent==0){
        //parcentage = 100
        console.log('file sent');
      }else{
        const loaded = selectedFile.size - bytesNotSent;
        const percentage_ = Math.round((loaded * 100) / selectedFile.size );
        //per_change(percentage_)
      }
    }
    
    S.bind_F(["image", 'save_attachment_data', sfx(rowIdx + row)], ([temp_id]) => {
      const r = form.p_attachments_attachement_id[row]; form.p_attachments_attachement_id[row] = [r[0], r[1], temp_id] // d will be temp_id
      
      // Show Thumbnail when successfully uploaded:
      thumbnails[row] = URL.createObjectURL(selectedFile)
      /*Method 2
      const reader = new FileReader();
      reader.onload = function(e) { thumbnails[row] = e.target.result };
      reader.readAsDataURL(selectedFile);
      */
    }, selectedFile, 0, ["auth", "image_meta_data", 0], percentage_change);
  }
  function handleFileAdd() {
    // Not need This: if(!form.p_tones_tone_id[0]) { alert("Please Select a tone first."); return }
    form.p_attachments_attachement_id = form.p_attachments_attachement_id.concat([[0, p_tones_tone_id[0][0], 0, false, 0]]) //form.p_tones_tone_id[0],
    thumbnails[form.p_attachments_attachement_id.length - 1] = "images/great-success.png"
  }
  const handleFileDelete = (row) => () => {
    form.p_attachments_attachement_id = form.p_attachments_attachement_id.filter((_, i) => i !== row);
    thumbnails = thumbnails.filter((_, i) => i !== row);
    // form.p_attachments_attachement_id = form.p_attachments_attachement_id.slice(0, row).concat(form.p_attachments_attachement_id.slice(row + 1));
  }

  function handleDiamondAdd() { // Id , shape, color, name, pcs
    const arry = []
    form.p_clarity_clarity_id.forEach(ele => {
      const c = p_clarity_clarity_id.find((v) => v[0] == ele[0]) || []
      arry.push([ele[0], c[2] || "", 0, 0, 0, 0]) // clarity_id, clarity_name, weight, total_weight, rate,  price
    });
    form.p_d_size_diamond_size_id = form.p_d_size_diamond_size_id.concat([[0, shapes[0] && shapes[0][0] || 0, d_colors[0] && d_colors[0][0] || 0, sizes[0] && sizes[0][0] || 0, 0, 0, arry]])
  }
  const handleDiamondDelete = (row) => () => {
    form.p_d_size_diamond_size_id = form.p_d_size_diamond_size_id.filter((_, i) => i !== row);
    updateClarityTotal()
  }
  function handleColorAdd() { // Id , shape, color, nafme, pcs
    const arry = [[0, "", 0, 0, 0, 0]] // 0, "", weight, total_weight, rate,  price
    form.p_cs_size_cs_size_id = form.p_cs_size_cs_size_id.concat([[0, cs_types[0] && cs_types[0][0] || 0, shapes[0] && shapes[0][0] || 0, cs_colors[0] && cs_colors[0][0] || 0, sizes[0] && sizes[0][0] || 0, 0, 0, arry]])
  }
  const handleColorDelete = (row) => () => {
    form.p_cs_size_cs_size_id = form.p_cs_size_cs_size_id.filter((_, i) => i !== row);
    updateCSTotal()
  }
  const updatePurity = () => {
    // here form.p_purity_id is not working, because its a $: value
    const purityRow = p_purities_purity_id[purity_idx]
    if(purityRow){
      const toneIdx=purityRow[7].findIndex(x=>x[0]===form.p_tone_id)
      if(form.p_tone_id && toneIdx > -1) {
        
      } else {
        if(purityRow[7][0] && purityRow[7][0][0]){
          form.p_tone_id = purityRow[7][0][0]
        } else if(purityRow[7].length > 2){
          form.p_tone_id = purityRow[7][1][0]
        } else {
          form.p_tone_id = 0
        }
      }
    }
    updateVolume()
  }
  const updateVolume = ()  => {
    const purityRow = p_purities_purity_id[purity_idx];

    if(purityRow) {
      // For each percentage of purity in purity
      let sumPurDen = purityRow[5] * purityRow[6] / 100;// purity_per * sp_dencity / 100
      const tone=purityRow[7].find(x=>x[0]===form.p_tone_id)
      if(tone){ // y = pt.p_tone_id, pu_metal.pt2, pt.price
        if(tone[1]){
          tone[1].forEach(z=>{ //pm.metal_id, pm.purity, pm.price, m1.specific_density
            sumPurDen += z[1]*z[3] / 100
          })
        }
      }
      form.p_volume = form.p_weight / sumPurDen
    } else {
      form.p_volume = 0;
    }

    // also update each purity weight and price:---
    for (let i = 0; i < purity_new_id.length; i++) {
      const ele = purity_new_id[i];
      const purityRow_ = p_purities_purity_id.find(function(e) { return e[0] == ele[0]; });
      if(purityRow_) {
        ele[3].forEach(t=>{
            let sumPurDen = purityRow_[5] * purityRow_[6] / 100; // purity_per * sp_dencity / 100
            let sumPrice =  purityRow_[8]
            const toneRow=purityRow_[7].find(x=>x[0]===t[0])// y = pt.p_tone_id, pu_metal.pt2, pt.price
            toneRow[1].forEach(z=>{ //pm.metal_id, pm.purity, pm.price, m1.specific_density
              sumPurDen += z[1]*z[3] / 100
              sumPrice += z[2]
            })
            const newWeight = sumPurDen * form.p_volume
            const new_w = Math.floor(newWeight *1000) / 1000

            t[1] = new_w
            t[2] = Math.floor(new_w * sumPrice *1000) / 1000
        })
      }
      purity_new_id[i] = ele // This now not work when complex components.
      // purity_new_id = (purity_new_id)
    }

  }
  const clarityChange = async (e, clarity_id) => {
    for (const ele of form.p_d_size_diamond_size_id) {
      if(!ele[6]) continue
      const i = ele[6].findIndex((v)=>{
        return v[0] == clarity_id[0]
      })
      if(e.target.checked){
        if(i >= 0 ) {
          continue
        } else {
          ele[6] = ele[6].concat([[clarity_id[0], clarity_id[2], 0, 0, 0, 0]])
          const afn = diamondChange(ele)
          await afn()
        }
      } else {
        if( i < 0 ) {
          continue
        } else {
          ele[6] = ele[6].filter((v, i) => v[0] !== clarity_id[0]);
        }
      }
      
    }
    await updateClarityTotal()
  }
  const clarityIsMainChange = (e, index) =>{
    if(form.p_clarity_clarity_id.includes(clarity_new_id[index])) {
      for (let i = 0; i < clarity_new_id.length; i++) {
        const ele = clarity_new_id[i];
        ele[4] = false
      }
      clarity_new_id[index][4] = true
      clarity_new_id = (clarity_new_id)
    } else {
      clarity_new_id[index][4] = false
      clarity_new_id = (clarity_new_id)
    }
  }
  
  const purityIsMainChange = (e, index) =>{
    if(form.p_purities_purity_id.includes(purity_new_id[index])) {
      for (let i = 0; i < purity_new_id.length; i++) {
        const ele = purity_new_id[i];
        ele[2] = false
      }
      purity_new_id[index][2] = true
      purity_new_id = (purity_new_id)
    } else {
      purity_new_id[index][2] = false
      purity_new_id = (purity_new_id)
    }
  }
  const toneIsMainChange = (e, index, tindex) =>{
    if(purity_new_id[index][1].includes(purity_new_id[index][3][tindex])) {
      for (let i = 0; i < purity_new_id[index][3].length; i++) {
        const ele = purity_new_id[index][3][i];
        ele[3] = false
      }
      purity_new_id[index][3][tindex][3] = true
      purity_new_id = (purity_new_id)
    } else {
      purity_new_id[index][3][tindex][3] = false
      purity_new_id = (purity_new_id)
    }
  }
  const updateClarityTotal = () => {
    // for each that clarity update price too..
    clarity_new_id.forEach(ele0 => {
      let pcs = 0;
      let d = 0;
      let p = 0;
      form.p_d_size_diamond_size_id.forEach(ele1 => {
        pcs += ele1[4] || 0 // total Pcs
        if (ele1  && ele1[6]) {
          const r = ele1[6].find(r => r[0] == ele0[0])
          if (r) {
            d += r[3] // total weight
            p += r[5] // price
          }
        }
        });
      const c = clarity_new_id.find(v => v[0] == ele0[0])
      if(c){
        c[1] = pcs;
        c[2] = d;
        c[3] = p;
      }
    })
    clarity_new_id = (clarity_new_id)
  }
  const updateCSTotal = () => {
      let pcs = 0;
      let d = 0;
      let p = 0;
      form.p_cs_size_cs_size_id.forEach(ele1 => {
        pcs += ele1[5] || 0 // total Pcs
        if (ele1  && ele1[7]) {
          // const r = ele1[5].find(r => r[0] == ele0[0])
          const r = ele1[7][0]
          if (r) {
            d += r[3] || 0// total weight
            p += r[5] || 0// total price
          }
        }
        });
    form.p_cs_total_p_cs_total[0][0] = pcs
    form.p_cs_total_p_cs_total[0][1] = d
    form.p_cs_total_p_cs_total[0][2] = p
    
    form.p_cs_total_p_cs_total = (form.p_cs_total_p_cs_total)
  }
  const clearClarityPcs = (d) => () => {
    d[4] = 0
    d[6].forEach(ele => {
      if (ele) {
        ele[2] = 0 // weight
        ele[3] = 0 // total weight
        ele[4] = 0 // rate
        ele[5] = 0 // price
      }
    });
    updateClarityTotal()
    form.p_d_size_diamond_size_id = form.p_d_size_diamond_size_id
  }
  const clearCSPcs = (d) => () => {
    d[5] = 0
    d[7].forEach(ele => {
      if (ele) {
        ele[2] = 0 // weight
        ele[3] = 0 // total weight
        ele[4] = 0 // rate
        ele[5] = 0 // price
      }
      updateCSTotal()
      form.p_cs_size_cs_size_id = form.p_cs_size_cs_size_id
    });

    // for each that clarity update price too..
    // clarity_new_id.forEach(ele0 => {
    //   let d = 0;
    //   let p = 0;
    //   form.p_cs_size_cs_size_id.forEach(ele1 => {
    //     if (ele1  && ele1[5]) {
    //       const r = ele1[5].find(r => r[0] == ele0[0])
    //       if (r) {
    //         d += r[3] // total weight
    //         p += r[5] // price
    //       }
    //     }
    //     });
    //   const c = clarity_new_id.find(v => v[0] == ele0[0])
    //   if(c){
    //     c[1] = d;
    //     c[2] = p;
    //   }
    // })

    form.p_cs_size_cs_size_id = form.p_cs_size_cs_size_id
    // clarity_new_id = (clarity_new_id)
  }

  const diamondChange = (d) => async() => {
    if(d[4] > 0) {
      const prices = await new Promise((resolve, reject) => { S.bind_(["product", "diamond_price_data", 111], ([data]) => { resolve(data) }, d); });
      
      prices.forEach(ele => {
        const v = d[6].find(v => v[0] == ele[0])
        if (v) {
          v[2] = ele[2] // weight
          v[3] = ele[3] // total weight
          v[4] = ele[4] // rate
          v[5] = ele[5] // price
        }
      });
      form.p_d_size_diamond_size_id = form.p_d_size_diamond_size_id
      updateClarityTotal()
    }
  }
  const csChange = (d) => async() => {
    if(d[5] > 0) {
      const prices = await new Promise((resolve, reject) => { S.bind_(["product", "cs_price_data", 111], ([data]) => { resolve(data) }, d); });
      
      prices.forEach(ele => {
        // const v = d[5].find(v => v[0] == ele[0])
        const v = d[7][0]
        if (v) {
          v[2] = ele[2] // weight
          v[3] = ele[3] // total weight
          v[4] = ele[4] // rate
          v[5] = ele[5] // price
        }
      });
      form.p_cs_size_cs_size_id = form.p_cs_size_cs_size_id
      updateCSTotal()
    }
  }

  import 'flatpickr/dist/flatpickr.css'
	import 'flatpickr/dist/themes/light.css'

/* attachments i had:
  {#each p_tones_tone_id as c}
    {#if form.p_tones_tone_id.includes(c[0])}
    <option value={c[0]}> {c[2]} </option>
    {/if}
  {/each}
*/
	const foo = (node, pindex, a) => {
    // the node has been mounted in the DOM
    if(purity_new_id[pindex][3].includes(a[0])){
      node.checked = true
    }

		return {
      // update(pindex, a) {
      //   if(purity_new_id[pindex][3].includes(a[0])){
      //     node.checked = true
      //   }
      // },
			destroy() {
				// the node has been removed from the DOM
			}
		};
  }
  const selectAllPurities = () => {
    purity_new_id.forEach((v, i)=>{
      if( p_purities_purity_id[i][7][0][0]){
        if(!form.p_purities_purity_id.includes(v)){
          form.p_purities_purity_id.push(v)
        }
      }
    })
    form.p_purities_purity_id = (form.p_purities_purity_id)
  }
  const removeAllPurities = () => {

    form.p_purities_purity_id = []
  }
</script>

<form class="admin" on:submit|preventDefault={save} >
	<label><span>Title</span><input type="text" bind:value={form.title} required on:change={_=> {if(!form.name.length){form.name = form.title.toLowerCase().replace(/\s/g, "_")}}} /></label>
	<label><span>Slug</span><input type="text" bind:value={form.name} required/></label>
	<label><span>Date</span><input bind:this={date} /></label>

	<label><span>Product tags</span><textarea cols="20" rows="2" bind:value={form.tags_name}></textarea></label>
	{#if false}<label><span>Purchase note</span><textarea cols="20" rows="2" bind:value={form.p_purchase_note}></textarea></label>{/if}
  {#if false}<label><span>Menu order</span><input type="number" bind:value={form.menu_order} /></label>{/if}
	<label><span>Enable reviews</span><input type="checkbox" bind:checked={form.comment_status} /></label>
  {#if false}
      <label><span>Status</span>
        <select bind:value={form.status} size=3 >
          <option value="published">Published</option>
          <option value="pending review">Pending Review</option>
          <option value="draft">Draft</option>
        </select>
      </label>

        <label><span>Visibility</span>
          <select bind:value={form.visibility} on:change|preventDefault={setPasswordDisabled} >
            <option value="public">Public</option>
            <option value="password protected">Password protected</option>
            <option value="private">Private</option>
          </select>
        </label>
        {#if form.visibility == "password protected"}
          <label><span>Password</span><input type="text" bind:value={form.password} disabled={form.visibility != "password protected"}/></label>
        {/if}

        <label><span>Product Type</span>
          <select bind:value={form.p_product_type} size=4>
            <option value="simple">Simple product</option>
            <option value="grouped">Grouped product</option>
            <option value="variable">Variable product</option>
            <option value="external">External/Affiliate product</option>
          </select>
        </label>
  {/if}
    {#if false}<label><span>Virtual</span><input type="checkbox" bind:checked={form.p_virtual} /></label>{/if}
    {#if false}<label><span>Downloadable</span><input type="checkbox" bind:checked={form.p_downloadable} /></label>{/if}
    
		
		<label><span>SKU</span><input type="text" bind:value={form.p_sku} /></label>
		{#if false}<label><span>Price</span><input type="number" bind:value={form.p_min_price} step="any" /></label>{/if}
		{#if false}<label><span>Sale</span><input type="number" bind:value={form.p_max_price} /></label>{/if}
		<label><span>Weight</span><input type="number" bind:value={form.p_weight} step="any"  on:change={updateVolume} /></label>
    <label><span>Purity</span>
      <select bind:value={purity_idx} on:change={updatePurity}>
        {#each p_purities_purity_id as s, index}
        <option value={index}> {s[3]} </option>
        {/each}
      </select>
    </label>
    <label><span>Tone</span>
      <select bind:value={form.p_tone_id} required on:change={updateVolume} >
        {#each tone_selected as c}
          {#if c[0]}
          <option value={c[0]}> {getToneName(p_tones_tone_id, c[0])} </option>
          {/if}
        {/each}
      </select>
    </label>
    {#if false}
      {form.p_tone_id}
      {form.p_volume}
    {/if}
		<label><span>Length</span><input type=number bind:value={form.p_length} step="any" /></label>
		<label><span>Width</span><input type=number bind:value={form.p_width} step="any"/></label>
		<label><span>Height</span><input type=number bind:value={form.p_height} step="any" /></label>
		
    {#if false}
      <label><span>Shipping class</span>
        <select bind:value={form.p_shipping_class_id} >
          {#each shipping_class as s}
          <option value={s[0]}> {s[1]} </option>
          {/each}
        </select>
      </label>
      <label><span>Catalog visibility</span>
        <select bind:value={form.p_catalog_visibility} size=4 >
          <option value="shop & search results">Shop and search results</option>
          <option value="shop only">Shop only</option>
          <option value="search results only">Search results only</option>
          <option value="hidden">Hidden</option>
        </select>
      </label>
      <label><span>Featured</span><input type="checkbox" bind:checked={form.p_featured} /></label>
      
      <label><span>Manage stock?</span><div><input type="checkbox" bind:checked={form.p_manage_stock} on:change|preventDefault={setManageStock} />Enable stock management at product level</div></label>

      {#if form.p_manage_stock}
          <label><span>Stock Qty</span><input type="number" bind:value={form.p_stock_quantity} /></label>
          <label><span>Allow Backorders?</span>
            <select bind:value={form.p_backorders} size=3 >
              <option value="do not allow" >Do not allow</option>
              <option value="allow, but notify customer">Allow, but notify customer</option>
              <option value="allow" >Allow</option>
            </select>
          </label>
          <label><span>Low stock threshold</span><input type="number" bind:value={form.p_low_stock_amount} /></label>
          
      {:else}
          <label><span>In stock?</span>
            <select bind:value={form.p_stock_status} size=3 >
              <option value="instock" >In Stock</option>
              <option value="outofstock">Out of stock</option>
              <option value="onbackorder" >On backorder</option>
            </select>
          </label>
      {/if}
      <label><span>Sold individually</span><div><input type="checkbox" bind:checked={form.p_sold_individually} />Enable this to only allow one of this item to be bought in a single order</div></label>
    {/if}
    <div class="row">
      <div class="column"><b>Details:</b><textarea class="tinymce_p_content" cols="20" rows="2" bind:value={form.content} ></textarea></div>
      <div class="column"><b>Short description:</b><textarea class="tinymce_p_excerpt" cols="20" rows="2" bind:value={form.excerpt}></textarea></div>
    </div>


    <table>
      <tbody>
        {#each p_certified_by_certified_by as c}
          <tr>
            <td><label for="cert{rowIdx}{c[0]}">{c[2]}</label></td>
            <td><input id="cert{rowIdx}{c[0]}" type=checkbox bind:group={form.p_certified_by_certified_by} value={c[0]} ></td>
          </tr>
        {/each}
      </tbody>
    </table>
    <table>
      <tbody>
        {#each p_policy_post_policy as c}
          <tr>
            <td><label for="policy{rowIdx}{c[0]}">{c[1]}</label></td>
            <td><input id="policy{rowIdx}{c[0]}" type=checkbox bind:group={form.p_policy_post_policy} value={c[0]} ></td>
          </tr>
        {/each}
      </tbody>
    </table>
	<label><span>Making Charges</span><input type="number" bind:value={form.p_making_charges} step="any"/></label>
	<label><span>Discount %</span><input type="number" bind:value={form.p_discount_per} step="any"/></label>
 

  <div class="row">
    <div class="column checks"><b>Categories:</b>
      <table>
      <tbody>
        {#each pc_category_id as c}
          <tr>
            <td><label for="category{rowIdx}{c[0]}">{@html c[1].replace(/\s/g, "&nbsp")}</label></td>
            <td><input id="category{rowIdx}{c[0]}" type=checkbox bind:group={form.pc_category_id} value={c[0]}></td>
          </tr>
        {/each}
      </tbody>
      </table>
    </div>
    {#if false}
    <div class="column checks"><b>Tones:</b>
      <table>
      <tbody>
        {#each p_tones_tone_id as c}
        <tr>
            <td><label for="tone{rowIdx}{c[0]}">{c[2]}</label></td>
            <td><input id="tone{rowIdx}{c[0]}" type=checkbox bind:group={form.p_tones_tone_id} value={c[0]} on:click={(e)=>{
              if(attachment_p_tones_tone_ids.includes(c[0])) {
                e.preventDefault()
                e.stopPropagation()
                return false;
              }
            }}></td>
            
          </tr>
        {/each}
      </tbody>
      </table>
    </div>
    {/if}
    
    <div class="column"><b on:click={selectAllPurities}>Purities:</b>
      <table>
        <tbody>
          <tr>
            <th on:click={removeAllPurities}>Purity</th>
            <th>Is Main</th>
          </tr>
          {#each p_purities_purity_id as c, index}
          {#if c[7][0][0]}
          <tr>
            <td> <label><input type=checkbox bind:group={form.p_purities_purity_id} value={purity_new_id[index]}  on:change={updateVolume} > {c[3]} </label></td>
            <td> <input type=checkbox bind:checked={purity_new_id[index][2]} on:click={(e)=>purityIsMainChange(e, index)}></td>
            <td>
              <table>
                <tbody>
                  <tr>
                    <th>Tone</th>
                    <th></th>
                    <th>Weight</th>
                    <th>Price</th>
                    <th>Is Main</th>
                  </tr>
                  {#each c[7] as e, tindex}
                    {#if e[0]}
                    <tr>
                        <ToneGroup bind:tones={purity_new_id[index][1]} value={purity_new_id[index][3][tindex]} toneName={getToneName(p_tones_tone_id, e[0])} on:change={updateVolume} on:click={(e)=>toneIsMainChange(e, index, tindex)}/>
                    </tr>
                    {/if}
                  {/each}
                </tbody>
              </table>
            </td>
          </tr>
          {/if}
          {/each}
        </tbody>
      </table>
    </div>
    <div class="column"><b>Clarities:</b>
      <table>
        <tbody>
          <tr>
            <th>Clarity</th>
            <th></th>
            <th>PCs</th>
            <th>Weight</th>
            <th>Price</th>
            <th>Is Main</th>
          </tr>
          {#each p_clarity_clarity_id as c, index}
          <tr>
            <td><label for="clarity{rowIdx}{c[0]}">{c[2]}</label></td>
            <td><input id="clarity{rowIdx}{c[0]}" type=checkbox bind:group={form.p_clarity_clarity_id} value={clarity_new_id[index]} on:click={(e)=>clarityChange(e, c)}></td>
            <td><input class="w100" type=number bind:value={clarity_new_id[index][1]}  step="any" disabled/></td>
            <td><input class="w100" type=number bind:value={clarity_new_id[index][2]}  step="any" disabled/></td>
            <td><input class="w100" type=number bind:value={clarity_new_id[index][3]}  step="any" disabled/></td>
            <td> <input type=checkbox bind:checked={clarity_new_id[index][4]} on:click={(e)=>clarityIsMainChange(e, index)}></td>
          </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <div><b>Diamonds:</b>
  {#if form.p_d_size_diamond_size_id.length}
    <table>
      <tbody>
        <tr>
          <th>Shape</th>
          <th>Color</th>
          <th>Size</th>
          <th>Pcs</th>
          <th>Setting Type</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
        {#each form.p_d_size_diamond_size_id as a, index}
        <tr>
          {#if a[1]}
              <td>
                <select bind:value={form.p_d_size_diamond_size_id[index][1]} required on:change={clearClarityPcs(a)} >
                  {#each shapes as c}
                    <option value={c[0]}> {c[3]} </option>
                  {/each}
                </select>
              </td>
              <td>
                <select bind:value={form.p_d_size_diamond_size_id[index][2]} required on:change={clearClarityPcs(a)} >
                  {#each d_colors as c}
                    <option value={c[0]}> {c[3]} </option>
                  {/each}
                </select>
              </td>
              <td>
                <select bind:value={form.p_d_size_diamond_size_id[index][3]} required on:change={clearClarityPcs(a)} >
                  {#each sizes as c}
                    <option value={c[0]}> {c[1]} </option>
                  {/each}
                </select>
              </td>              
              <td><input class="w150" type="number" bind:value={form.p_d_size_diamond_size_id[index][4]} min=0 on:change={diamondChange(a)} /></td>
              <td>
                <select bind:value={form.p_d_size_diamond_size_id[index][5]} >
                  {#each setting_type_id as s}
                  <option value={s[0]}> {s[1]} </option>
                  {/each}
                </select>
              </td>              
              <td>
                <table class="clarity_table">
                  <tbody>
                    <tr>
                      <th>Clarity</th>
                      <th>Weight</th>
                      <th>Total Weight</th>
                      <th>Rate</th>
                      <th>Price</th>
                    </tr>
                      {#if a[6]}
                        {#each a[6] as p}
                          {#if p[1]}
                            <tr>
                              <td>{p[1]}</td>
                              <td><input class="w100" type="number" bind:value={p[2]} min=0 disabled /></td>
                              <td><input class="w100" type="number" bind:value={p[3]} min=0 disabled /></td>
                              <td><input class="w100" type="number" bind:value={p[4]} min=0 disabled /></td>
                              <td><input class="w100" type="number" bind:value={p[5]} min=0 disabled /></td>
                            </tr>
                          {/if}
                        {/each}
                      {/if}
                      </tbody>
                    </table>
              </td>
              <td><button type="button" on:click={handleDiamondDelete(index)} >delete</button></td>
          {/if}
        </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  </div>
  <button type="button" on:click={handleDiamondAdd} >D Add</button>

  <div><b>Color Stones:</b>
  {#if form.p_cs_size_cs_size_id.length}
    <table>
      <tbody>
        <tr>
          <th>Type</th>
          <th>Shape</th>
          <th>Color</th>
          <th>Size</th>
          <th>Pcs</th>
          <th>Setting Type</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
        {#each form.p_cs_size_cs_size_id as a, index}
        <tr>
          {#if a[1]}
              <td>
                <select bind:value={form.p_cs_size_cs_size_id[index][1]} required  on:change={clearCSPcs(a)} >
                  {#each cs_types as c}
                    <option value={c[0]}> {c[1]} </option>
                  {/each}
                </select>
              </td>
              <td>
                <select bind:value={form.p_cs_size_cs_size_id[index][2]} required  on:change={clearCSPcs(a)} >
                  {#each shapes as c}
                    <option value={c[0]}> {c[3]} </option>
                  {/each}
                </select>
              </td>

              <td>
                <select bind:value={form.p_cs_size_cs_size_id[index][3]} required  on:change={clearCSPcs(a)} >
                  {#each cs_colors as c}
                    <option value={c[0]}> {c[3]} </option>
                  {/each}
                </select>
              </td>
              <td>
                <select bind:value={form.p_cs_size_cs_size_id[index][4]} required  on:change={clearCSPcs(a)} >
                  {#each sizes as c}
                    <option value={c[0]}> {c[1]} </option>
                  {/each}
                </select>
              </td> 
              <td><input class="w100" type="number" bind:value={form.p_cs_size_cs_size_id[index][5]} min=0  on:change={csChange(a)} /></td>   
              <td>
                <select bind:value={form.p_cs_size_cs_size_id[index][6]} >
                  {#each setting_type_id as s}
                  <option value={s[0]}> {s[1]} </option>
                  {/each}
                </select>
              </td>    
              <td>
                <table class="cs_table">
                  <tbody>
                    <tr>
                      <th>Weight</th>
                      <th>Total Weight</th>
                      <th>Rate</th>
                      <th>Price</th>
                    </tr>
                      {#each a[7] as p}
                      <tr>
                        <td><input class="w100" type="number" bind:value={p[2]} min=0 disabled /></td>
                        <td><input class="w100" type="number" bind:value={p[3]} min=0 disabled /></td>
                        <td><input class="w100" type="number" bind:value={p[4]} min=0 disabled /></td>
                        <td><input class="w100" type="number" bind:value={p[5]} min=0 disabled /></td>
                      </tr>
                      {/each}
                      </tbody>
                    </table>
              </td>
              <td><button type="button" on:click={handleColorDelete(index)} >delete</button></td>
          {/if}
        </tr>
        {/each}
      </tbody>
    </table>
    <table>
      <tbody>
        <tr>
          <th>Total CS Pcs</th>
          <th>Total CS Weight</th>
          <th>Total CS Price</th>
        </tr>
        <tr>
          <td><input type=number bind:value={form.p_cs_total_p_cs_total[0][0]} step="any" disabled class="w100" /></td>
          <td><input type=number bind:value={form.p_cs_total_p_cs_total[0][1]} step="any" disabled class="w100" /></td>
          <td><input type=number bind:value={form.p_cs_total_p_cs_total[0][2]} step="any" disabled class="w100" /></td>
        </tr>
      </tbody>
    </table>
  {/if}
  </div>
  <button type="button" on:click={handleColorAdd} >CS Add</button>
  

  <div><b>Images:</b>
  {#if form.p_attachments_attachement_id.length}
    <table>
      <tbody>
        <tr>
          <th>Tone</th>
          <th>File</th>
          <th>Preview</th>
          <th>Main Image</th>
          <th>Actions</th>
        </tr>
        {#each form.p_attachments_attachement_id as a, index}
        <tr>
          {#if a[1]}
              <td>
                <select bind:value={form.p_attachments_attachement_id[index][1]} required>
                  {#each p_tones_tone_id as c}
                    <option value={c[0]}> {c[2]} </option>
                  {/each}
                </select>
              </td>
              <td><input type="file" on:change={handleFileChange(index)} accept="image/x-png, image/gif, image/jpeg" /> </td>
              <td><img src={thumbnails[index]} width=100 p_height=100 alt="image" /></td>
              <td><input type="checkbox" bind:checked={form.p_attachments_attachement_id[index][3]} />
              </td>
              <td><button type="button" on:click={handleFileDelete(index)} >delete</button></td>
          {/if}
        </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  </div>
  <button type="button" on:click={handleFileAdd} >Image Add</button>

  <div> {er} </div>

  <footer>
    <SubmitButton {isSaving} />
    <CancelButton {isSaving} {rowIdx} on:close />
    {#if rowIdx !== null} <button type="button" on:click={deleteRow} >Delete</button> {/if}
  </footer>
</form>
