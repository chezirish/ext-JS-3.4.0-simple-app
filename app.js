Ext.onReady(function() {

    //Запрет на дефолдное контекстное меню для более удобного управления приложением
    Ext.EventManager.on(document, 'contextmenu', function(e) {
            e.preventDefault();     
    });


    var tree = new Ext.tree.TreePanel({
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
                            Ext.Msg.alert('Свойства объекта', 'Нельзя удалить корневой объект'); 
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
        title:'Свойства объекта',
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
                    Ext.Msg.alert('Свойства объекта', 'Нельзя изменить корневой объект');                    
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

                        Ext.Msg.alert('Свойства объекта', 'Свойства к объекту сохранены!');
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
                            Ext.Msg.alert('Свойства объекта', 'Свойства к объекту сохранены!');
                        } else{
                            Ext.Msg.alert('Свойства объекта', 'У объекта должно быть имя!');                                              
                        }  
                    } else {
                        Ext.getCmp('name').setValue('');
                        Ext.getCmp('desc').setValue('');      
                        Ext.Msg.alert('Свойства объекта', 'Такой объект уже существует!');                                          
                    }
                    

                } else {
                    Ext.Msg.alert('Свойства объекта', 'Выберете объект!');               
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
        title:'Дерево объектов',
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

});   
