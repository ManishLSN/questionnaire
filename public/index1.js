var question="";
     var options = [],optionsToBeSent=[];
     var optionChoice=0;
     var optionButton;
     var count=0;
     var optionCount=0;

     var Component = React.createClass({
    
      getInitialState:function()
      {
        return{
        answerType:0,
        question:'',
        optionAdded:false,
        counter:0,
        optionsQuery:''
        }
      },
      

      setAnswerType:function(temp){
      this.state.answerType=temp;
      },
      
      setQuestion:function(temp){
      this.state.question = temp;
      question=temp;
      if(question.charAt(question.length)!='?'){
        question+='?';
      }
      },
     
      addOption:function(){
      optionCount++;
      var element =document.createElement('input');
      element.setAttribute('type', 'text');
      //  element.setAttribute('ref', 'av');
      element.setAttribute('value', 'this is vishal chandna');

      console.log(React.findDOMNode(this.refs['av']));
      var div = document.getElementById('a');

     
      div.appendChild(element);
     
      div.appendChild(document.createElement('br'));
      },
      addOptionButton:function(){
      optionChoice=2;
      if(count==0){
      this.setState({optionAdded:true});
      optionButton =<MultipleOptionButton />
      }
     // var div = document.getElementById('a');
     
     // div.appendChild(element1);
      count++;
     
     
      },

      removeOptions:function(){
       
       
        optionChoice=1;
        optionCount=0;
      var div = document.getElementById('op');
      while(div.firstChild){
      div.removeChild(div.firstChild);
      }
      var div1 = document.getElementById('option');
      while(div1.firstChild){
      div1.removeChild(div1.firstChild);
}
          count=0;
        
          options=[];
          this.setState({optionAdded:false});
          optionButton='';
      },

      submitForm: function(){
      
      this.setQuestion(document.getElementById('question').value);
     // for(var i = 1;i<=optionCount;i++){
     // options.push(document.getElementsByName(i));
     
      //options.push(React.findDOMNode(this.refs.av.refs.inp.getDOMNode));
    // }

      //console.log(document.getElementById('question').value);
       if(optionChoice==2){
        var temp = '';
        for(var i = 1;i<=optionCount;i++){
        optionsToBeSent.push(document.getElementById('t'+i).value); 
        temp=temp+document.getElementById('t'+i).value+'\t';
        }
        console.log(temp);
        this.setState({
        optionsQuery:temp
        });
     }
    
  
      if(optionChoice==2)
      dpd.ques.post({question:question,optionChoice:optionChoice,options:optionsToBeSent}, function(session, error) {
        if (error) {
          alert(error.message);
        } else {
          location.href = "/";
        }
      });
    else if(optionChoice==1)
       dpd.ques.post({question:question,optionChoice:optionChoice,options:["Yes","No"]}, function(session, error) {
        if (error) {
          alert(error.message);
        } else {
          location.href = "/";
        }
      });
      },
      componentDidMount:function(){
     this.setState({counter:optionCount});
   console.log(this.state.counter);
      },
      render: function() {
       
        return (
       <form id ='a' method='post' action='/ques'> 
     <input type='hidden' value={this.state.optionsQuery} name = 'options'/>
       <h3 align = 'center'>
       Enter Your Question:
       </h3>
        <input type="text" placeholder="Enter Your Question" align='center'id='question' name='ques'/>
 
      <h3 align = 'center'>
        Select Answer Type:
      </h3>
    
      <label>
      <input type= 'radio' name='opt' value="1" onClick={this.removeOptions} />
      <span>
        Yes/No
        </span>
       
        </label>
        <label>
     <input type= 'radio' name='opt' value="2" onClick={this.addOptionButton} />
    <span>
        Multiple Choice
        </span>
       
        </label>
        <label>
     <input type= 'radio' name='opt' value="3" onClick={this.setAnswerType(3)} />
      
    <span>
        Single
        </span>
       
        </label>
       <br/>
     <div id = 'op'>

     {optionButton}
     </div>

    
       <br/>
        <input type = 'Submit' value = 'Submit'  onClick={this.submitForm} />
        <br/>

       </form>
        );
    
      }
    
    });
   
   var MultipleOptions= React.createClass({
  
    render:function(){
      return(<div>
      <input type ='text'  id={this.props.counter}/>

      </div>
      );
     }

   });
   var MultipleOptionButton= React.createClass({
    getInitialState:function(){
    return({counter:0});
    },
    updateState:function(){
       this.setState({counter:optionCount});
       console.log(this.state.counter);
    },
    addChoice : function(){
    optionCount++;
  
    options.push(<div><MultipleOptions counter={'t'+optionCount}/></div>);
    setTimeout(this.updateState, 50);
    
    },
    render:function(){
      return(<div>
      <input type ='button' name ='mc' value ='Add Option' onClick={this.addChoice}/>
      
      <div id ='options'>
      {options}
      </div>
      </div>
      );
    }

   });
 //   setInterval(function() {
    React.render(<Component />,document.getElementById('abc'));
 //   }, 50);
   