<script>
  import { onMount, onDestroy } from 'svelte'
  import { goto } from '@sapper/app'

  //export let menu_name
  //let menu_data = []

  onMount(() => {
    // const adminService = new AdminServiceClient('http://localhost:8090', null, null);
    // const request = new messages.MenuRequest();
    // request.setName(menu_name);
    // adminService.getMenu(request, {}, function(err, response) {
    //   //const response = new messages.MenuResponse;
    //   if(err){
    //     console.log(err)
    //   } else {
    //     const menu = response.getMenuList();
    //     // no need to convert to json.
    //     function getMenu(menu_) {
    //       return menu_.map(m => {
    //         return {name: m.getName(), path: m.getPath(), icon: m.getIcon(), children: getMenu(m.getChildrenList())}
    //       })
    //     }
    //     menu_data = getMenu(menu);
    //   }
    // });
  })

  const onHeaderClick = m => () => {
    //const response = new messages.MenuResponse;
    //const m = response.getMenuList()[0]
    if (!m.children.length) {
      goto(m.path)
    }
  }
</script>

<style>

</style>
