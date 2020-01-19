import {getRequest} from "./api";
/*
* 对菜单路由进行处理
* */


export const initMenu=(router, store)=>{
    if (store.state.routes.length > 0){
        return;
    }
    getRequest("/system/config/menu").then(data=>{
        if (data ){
            let fmtRoutes = formatRoutes(data);
            //添加路由
            router.addRoutes(fmtRoutes);
            //初始化数据
            store.commit('initRoutes',fmtRoutes);

        }
    })
}
/*
* 菜单数据的格式话
* */
export const formatRoutes = (routes) => {
    let fmRoutes = [];
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            meta,
            iconcls,
            children
        } = router;
        if (children && children instanceof Array) {
            children = formatRoutes(children);
        }
        let fmRouter = {
            path: path,
            name: name,
            iconcls: iconcls,
            meta: meta,
            hidden:false,
            children: children,
            component(resolve) {
                if (component.startsWith("Home")) {
                    require(['../views/' + component + '.vue'], resolve);
                } else if (component.startsWith("Emp")) {
                    require(['../views/emp/' + component + '.vue'], resolve);
                } else if (component.startsWith("Per")) {
                    require(['../views/per/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sal")) {
                    require(['../views/sal/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sta")) {
                    require(['../views/sta/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sys")) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                }
            }
        }
        fmRoutes.push(fmRouter);
    })
    return fmRoutes;
}
/*export const formatRoutes = (routes) => {
    let fmRoutes = [];
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            meta,
            iconcls,
            children
        } = router;
        window.console.log(JSON.stringify(component));
        if (children && children instanceof Array) {
            children = formatRoutes(children);
        }

       /!* /!*组件赋值*!/!*!/
        let fmRouter = {
            path: path,
            name: name,
            iconcls: iconcls,
            meta: meta,
            children: children,
            component() {
               alert(JSON.stringify(component));
                if (component.startsWith("Home")) {
                    () => import('../views/' + component + '.vue');
                } else if (component.startsWith("Emp")) {
                    () =>  import('../views/emp/' + component + '.vue');
                } else if (component.startsWith("Per")) {
                    () => import('../views/per/' + component + '.vue');
                } else if (component.startsWith("Sal")) {
                    () => import('../views/sal/' + component + '.vue');
                } else if (component.startsWith("Sta")) {
                    () =>  import('../views/sta/' + component + '.vue');
                } else if (component.startsWith("Sys")) {
                    () => import('../views/sys/' + component + '.vue');
                }
            }
        };
        window.console.log(JSON.stringify(fmRouter));
        fmRoutes.push(fmRouter);
    })
    return fmRoutes;
}*/
