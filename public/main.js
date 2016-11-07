    const render = function(data){
        const listContainer = $('#listContainer').html('');
        data.forEach(function(element){
            let checked = '';
            if(element.checked){
                checked = 'checked';
            }
        listContainer.append($("<li>"+element.name+"</li><input type='checkbox' class='box' id = '"+element.id+"'"+checked+"/><button class='delete' id = '" +element.id+"'>Delete</button>"));
        
        });

    };
    const update = function(){
        $.ajax({
        url      : "/todos",
        type     : 'get',
        dataType : 'json',
        success  : function(data) {
            console.log(data);
         render(data.items);

            // render 'data' on the screen
        },
        error    : function(data) {
            alert('Error searching');
        }
    }); 
         
    }

    $('#search').on('click', function(){
    const searchtext = $('#searchtxtbx').val(); // get
    $.ajax({
        url      : "/todos",
        type     : 'get',
        dataType : 'json',
        data     : {
            searchtext : searchtext
        },
        success  : function(data) {
            render(data.items);// render 'data' on the screen
        },
         error : function(data) {
            alert('Error searching');
        }
    }); 
}); 


    $("#save").on('click', function(){
    const val = $('#msgtxtbx').val();      // post
    $('#msgtxtbx').val(''); // clear the textbox

    $.ajax({
        url         : "/todos",
        type        : 'post',
        dataType    : 'json',
        data        : JSON.stringify({
            name   : val,
            checked : false
        }),
        contentType : "application/json; charset=utf-8",
        success     : function(data) {
            update();// refresh the list (re-run the search query)
        },
        error       : function(data) {
            alert('Error creating todo');
        }
    }); 
});

        $("#listContainer").on('change','.box', function(e){
        $.ajax({                                       // update
        url         : "/todos/" + e.target.id,
        type        : 'put',
        dataType    : 'json',
        data        : JSON.stringify({
            checked: e.target.checked,
            id : e.target.id,
        }),
        contentType : "application/json; charset=utf-8",
        success     : function() {
               
        },
        error       : function(data) {
            alert('Error creating todo');
        }
    });
        });

    $('#listContainer').on('click','.delete', function(e){
        $.ajax({                            // delete
        url     : "/todos/" + e.target.id,
        type    : 'delete',
        success : function(data) {
            update(data); // remove the rendering of that item from the UI
        },
        error   : function(data) {
            alert('Error deleting the item');
        }
          });
    }); 
    
    update();