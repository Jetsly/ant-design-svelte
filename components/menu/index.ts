import Menu from './menu.svelte';
import Item from './menu-item.svelte';
import SubMenu from './sub-menu.svelte';
import ItemGroup from './item-group.svelte';
Menu['Item'] = Item
Menu['SubMenu'] = SubMenu
Menu['ItemGroup'] = ItemGroup
export default Menu;
