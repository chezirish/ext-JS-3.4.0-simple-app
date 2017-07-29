Ext.onReady(function() {


    Ext.EventManager.on(document, 'contextmenu', function(e) {
            e.preventDefault();     
    });


    var tree = new Ext.tree.TreePanel({
        // renderTo: 'tree',
        pageX : 200,
        useArrows: true,
        autoScroll: true,
        animate: true,
        enableDD: true,
        containerScroll: true,
        border: false,
        root: {
            nodeType: 'async',
            text: 'Корень',
            draggable: false,
            id: 'source',
            expanded: true,
            children: [
            {
                text: 'объект',
                leaf: false,
                expanded: true,
                children: []
            }
            ]
        },
        contextMenu: new Ext.menu.Menu({
            items: [{
                id: 'delete-node',
                text: 'Удалить объект'
            },{
                id: 'add',
                text: 'Добавить объект'
            }],
            listeners: {
                itemclick: function(item) {
                    var n = item.parentMenu.contextNode;
                    if(item.id == 'delete-node') {                          
                        if (n.parentNode) {
                            myStore.removeAt(Ext.get("name").dom.value);
                            n.remove();
                        } else {
                            Ext.Msg.alert('Свойства объкта', 'Нельзя удалить корневой объект'); 
                        }
                    } else if(item.id == 'add'){
                            n.appendChild({
                                text: 'Новый объект',
                                leaf: false,
                                expanded: true,
                                children: []
                            });
                    }
                }
            }
        }),
        listeners: {
            contextmenu: function(node, e) {
                node.select();
                var c = node.getOwnerTree().contextMenu;
                c.contextNode = node;
                c.showAt(e.getXY());
            },
            click: function(item) {
                var obj = myStore.getById(item.ui.anchor.text);
                if(obj){
                    Ext.getCmp('name').setValue(obj.data.name);
                    Ext.getCmp('desc').setValue(obj.data.desc);
                } else {
                    Ext.getCmp('name').setValue('');
                    Ext.getCmp('desc').setValue(''); 
                }
                

            }
        }
    });

    winObj = new Ext.Window({
        x: 600,
        y: 100,
        draggable: false,
        resizable: false,
        closeable: false,
        // Странно свойство closeable не прячет кнопку закрытия , но следующий код помогает
        tools: [{
            id:'close',
            hidden: true,
        }],
        hidden: false,
        title:'Свойства объкта',
        layout:'form',
        width: 400,
        closeAction:'close',
        plain: true,
        items: [{
           id: 'name',
           xtype : 'textfield',
           fieldLabel: 'Название'
        },{
           id: 'desc',
           xtype : 'textarea',
           fieldLabel: 'Описание'
        }],
        buttons: [{
           text: 'Сохранить',
           handler: function(){
                if(Ext.query('.x-tree-selected[id=extdd-1]')[0]){
                    Ext.Msg.alert('Свойства объкта', 'Нельзя изменить корневой объект');                    
                } else if(Ext.query('.x-tree-selected')[0]){
                    var nameOfObj = Ext.get("name").dom.value;
                    var descOfObj = Ext.get("desc").dom.value;
                    

                    if(!myStore.getById(nameOfObj) && nameOfObj !== ''){
                        Ext.query('.x-tree-selected a span')[0].innerHTML = nameOfObj;

                        var obj = {
                            name: nameOfObj,
                            desc: descOfObj
                        };

                        var record = new myStore.recordType(obj, obj.name);
                        myStore.add(record);

                        Ext.Msg.alert('Свойства объкта', 'Свойства к объекту сохранены!');
                    } else if(nameOfObj === '') {
                        var obj = {
                            name: Ext.query('.x-tree-selected a span')[0].innerHTML,
                            desc: descOfObj
                        };


                        var exist = myStore.getById(obj.name);
                        if(exist){
                            myStore.removeAt(obj.name);
                            var record = new myStore.recordType(obj, obj.name);
                            myStore.add(record); 
                            Ext.Msg.alert('Свойства объкта', 'Свойства к объекту сохранены!');
                        } else{
                            Ext.Msg.alert('Свойства объкта', 'У объекта должно быть имя!');                                              
                        }  
                    } else {
                        Ext.getCmp('name').setValue('');
                        Ext.getCmp('desc').setValue('');      
                        Ext.Msg.alert('Свойства объкта', 'Такой объект уже существует!');                                          
                    }
                    

                } else {
                    Ext.Msg.alert('Свойства объкта', 'Выберете объект!');               
                } 
           }
        }],
        buttonAlign: 'center',
        listeners: {
            beforeclose: function() {
                return false;
            }
        }
    });

     // Ext.create('Ext.Button', {
     //    renderTo: Ext.getElementById('buttonId'),
     //    text: 'Click Me',
     //    listeners: {
     //       click: function() {
     //          win.show();
     //       }
     //    }
     // });

    winTree = new Ext.Window({
        x: 100,
        y: 100,
        closeable: false,
        // Странно свойство closeable не прячет кнопку закрытия , но следующий код помогает
        tools: [{
            id:'close',
            hidden: true,
        }],
        draggable: false,
        resizable: false,
        hidden: false,
        title:'Дерево объктов',
        width: 400,
        plain: true,
        items: [tree],
        // Запрет на закрытие окна, так как его еще можно закрыть на esc
        listeners: {
            beforeclose: function() {
                return false;
            }
        }
     });
    // winTree.setPosition(100, 100);


    var rt = Ext.data.Record.create([
        {name: 'title'},
        {name: 'textarea'}
    ]);

    var myStore = new Ext.data.Store({
        reader: new Ext.data.ArrayReader(
            {
                idIndex: 0
            },
            rt
        )
    });   


    // var defaultData = {
    //     name: 'obj',
    //     desc: 'some obj'
    // };

    // var r = new myStore.recordType(defaultData, defaultData.name); // create new record
    // myStore.add(r);



    // var lol = {
    //     name: 'obj2',
    //     desc: 'some obj2'
    // };

    // var r = new myStore.recordType(lol, lol.name); // create new record
    // myStore.add(r);




    addEventListener('click', function() {
         
                    
        // console.log(myStore.getById(123))

    })

});   