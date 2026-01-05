namespace menuTree {

    let menuCursorX
    let menuCursorY

    export class MenuTree {
        readonly items: ([string, Image] | MenuTree)[] = []
        readonly menu: miniMenu.MenuSprite
        subMenu: boolean
        active: boolean
        pos: { x: number, y: number }

        constructor(title: any, items: any[], pos?: { x: number, y: number }) {

            let menus: miniMenu.MenuItem[] = []
            for (let item of items) {
                if (item instanceof MenuTree) {
                    menus.push(miniMenu.createMenuItem(item.menu.title.text))
                    item.subMenu = true
                    item.activate(false, false)
                } else {
                    if (!item) item = { t: "", i: null }
                    menus.push(miniMenu.createMenuItem(item.s, item.i))
                }
            }

            this.items = items
            this.pos = pos
            this.menu = miniMenu.createMenuFromArray(menus)
            
            if (!title) title = { t: "", i: null }
            this.menu.title = miniMenu.createMenuItem(title.s, title.i)

            
            this.menu.setDimensions(this.menu.width, this.menu.height + this.menu.title.getHeight(this.menu.defaultStyle))
            this.menu.onButtonPressed(controller.B, () => {
                this.back()
            })
            if (pos != undefined) this.menu.setPosition(pos.x, pos.y)

            this.activate(true, true)
            menuTreeUtils.menuTrees.push(this)
        }
        forward(i: number) {
            const item = this.items[i];
            if (!(item instanceof MenuTree)) return;

            this.activate(false, true)
            item.activate(true, true)

            const itemBox = miniMenu.getItemBounds(this.menu, this.menu.selectedIndex); // keep this semicolon
            const menu = item.menu;

            // Only set position manually if this.pos is null/undefined
            if (!this.pos) {
                // some code used from WoofWoofCodes/pxt-mini-menu-cursor (thanks woofwoof :D)
                menu.setPosition(
                    this.menu.x + this.menu.width / 2 + menu.width / 2,
                    itemBox.y + menu.height / 2 - 1
                );

                if (menu.bottom > screen.height) {
                    menu.setPosition(
                        this.menu.x + this.menu.width / 2 + menu.width / 2,
                        itemBox.y + itemBox.h - menu.height / 2 - 1
                    );

                    if (menu.top < 0) {
                        menu.setDimensions(menu.width, itemBox.y + itemBox.h);
                        menu.setPosition(
                            this.menu.x + this.menu.width / 2 + menu.width / 2,
                            itemBox.y + itemBox.h - menu.height / 2 - 1
                        );
                    }
                }
            } else {
                // Still set dimensions if needed, but skip position
                if (menu.top < 0) {
                    menu.setDimensions(menu.width, itemBox.y + itemBox.h);
                }
            }

            menu.selectedIndex = 0;

            let menuTrees: MenuTree[] = [this]
            while (!menuTrees[0].active) {
                menuTrees.unshift(menuTrees[0].items[menuTrees[0].menu.selectedIndex] as MenuTree)
            }
            if (menuTrees[0].menu.x + menuTrees[0].menu.width / 2 > screen.width) {
                const distance = screen.width - (menuTrees[0].menu.x + menuTrees[0].menu.width / 2)
                for (let menuTree of menuTrees) {
                    menuTree.menu.setPosition(menuTree.menu.x + distance, menuTree.menu.y)
                }
            }
        }

        back() {
            if (!this.subMenu) {
                let item: MenuTree = this
                while (!item.active) {
                    item = (item.items[item.menu.selectedIndex] as MenuTree)
                }
                if (item != this) {
                    (item as MenuTree).activate(false, false)
                    this.activate(true, true)

                    const distance = screen.width - (item.menu.x + item.menu.width / 2)
                    if (distance > 0) {
                        let menuTrees: MenuTree[] = [this]
                        while (!menuTrees[0].active) {
                            menuTrees.unshift(menuTrees[0].items[menuTrees[0].menu.selectedIndex] as MenuTree)
                            menuTrees[0].menu.setPosition(menuTrees[0].menu.x + distance, menuTrees[0].menu.y)
                        }
                    }

                    let menuTrees: MenuTree[] = [this]
                    while (!menuTrees[0].active) {
                        menuTrees.unshift(menuTrees[0].items[menuTrees[0].menu.selectedIndex] as MenuTree)
                    }
                    if (menuTrees[0].menu.x + menuTrees[0].menu.width / 2) {
                        const distance = screen.width - (menuTrees[0].menu.x + menuTrees[0].menu.width / 2)
                        for (let menuTree of menuTrees) {
                            menuTree.menu.setPosition(menuTree.menu.x - distance, menuTree.menu.y)
                        }
                    }
                }
            }
        }
        destroy() {
            menuTreeUtils.menuTrees = menuTreeUtils.menuTrees.filter(num => num !== this);
        }
        setItemText(i: number, str: string) {
            this.menu.items[i].text = str
        }
        activate(activate: boolean, visible: boolean) {
            this.menu.setFlag(SpriteFlag.Invisible, !visible)
            this.active = activate
            if (activate) {
                this.menu.onButtonPressed(controller.up, () => {
                    this.menu.moveSelection(miniMenu.MoveDirection.Up)
                })
                this.menu.onButtonPressed(controller.down, () => {
                    this.menu.moveSelection(miniMenu.MoveDirection.Down)
                })
                this.menu.onButtonPressed(controller.A, () => {
                    this.forward(this.menu.selectedIndex)
                })
            } else {
                this.menu.onButtonPressed(controller.up, function (text: string, i: number) { })
                this.menu.onButtonPressed(controller.down, function (text: string, i: number) { })
                this.menu.onButtonPressed(controller.A, function (text: string, i: number) { })
            }
            if (!visible) this.menu.setPosition(-99999, -99999) // or really anywhere that makes it off-screen (dont remeber why i have that, it may not be needed)
        }
    }
    export class MenuTreeUtils {
        shiftInactiveMenuColors() {
            for (let menuTree of this.menuTrees) {
                if (!menuTree.active) {
                    this.shiftMenuColors(
                        menuTree.menu.x - menuTree.menu.width / 2,
                        menuTree.menu.y - menuTree.menu.height / 2,
                        menuTree.menu.width - 1,
                        menuTree.menu.height - 1)
                }
            }
        }
        shiftMenuColors(x: number, y: number, width: number, height: number) {
            // 3 -> 2
            // 1 -> 11
            for (let indexX = 0; indexX <= width; indexX++) {
                for (let indexY = 0; indexY <= height; indexY++) {
                    let color = screen.getPixel(x + indexX, y + indexY)
                    if (color == 3) // pink
                        color = 2 // red
                    else if (color == 1) // white
                        color = 11 // gray

                    screen.setPixel(x + indexX, y + indexY, color)
                }
            }
        }
        menuTrees: MenuTree[] = []
        constructor() {
            spriteutils.createRenderable(100, (screen) => {
                this.shiftInactiveMenuColors()
            })
        }
    }

    const menuTreeUtils: MenuTreeUtils = new MenuTreeUtils()
}

namespace miniMenu {
    /**
    * function to get the bounds of a menu's item.
    * @param menu The menu to get bounds from.
    * @param i The item of the menu, or -1 for the title.
    */
    //% block="$menu get bounds of item $i"
    //% group=Styling
    //% color="#36b58b"
    export function getItemBounds(menu: miniMenu.MenuSprite, i: number) {
        if (i < -1 || i >= menu.items.length) return { x: 0, y: 0, w: 0, h: 0 }

        let x = menu.left + (menu.frame ? menu.frame.height / 3 : 0) + menu.menuStyle.padding - menu.xScroll
        let y = menu.top + (menu.title ? menu.title.getHeight(menu.titleStyle) : 0) + (menu.frame ? menu.frame.height / 3 : 0) + menu.menuStyle.padding - Math.floor(menu.yScroll)
        let w, h

        if (menu.menuStyle.columns <= 1 && menu.menuStyle.rows <= 1) {
            // most likely
            for (let j = 0; j < i; j++) y += menu.items[j].getHeight(menu.selectedStyle)
            if (i == -1) {
                w = menu.title.getWidth(menu.selectedStyle)
                h = menu.title.getHeight(menu.selectedStyle)
            } else {
                w = menu.items[i].getWidth(menu.selectedStyle)
                h = menu.items[i].getHeight(menu.selectedStyle)
            }
        }

        return { x: Math.floor(x + 1), y: Math.floor(y + 1), w: Math.floor(w), h: Math.floor(h) }
    }

    /*
     * Helper function to create a MenuTree instance.
     * @param title The title of this menu node.
     * @param items Array of either Submenus or string and image. (string and image through createMenuItem())
     * @param pos set the position of the menu, can be undefined or null.
     * @return a MenuTree
     */
    //% blockId=mini_menu_create_menu_tree
    //% block="Create MenuTree title $title items $items||pos $pos"
    //% group="Create"
    //% weight=90
    //% title.shadow=""
    //% items.shadow="lists_create_with"
    //% pos.shadow=""
    //% color="#36b58b"
    //% blockSetVariable=myMenuTree
    export function createMenuTree(
        title: { s: string, i: Image },
        items: any[],
        pos?: { x: number, y: number }
    ): menuTree.MenuTree {
        return new menuTree.MenuTree(title, items, pos);
    }

}