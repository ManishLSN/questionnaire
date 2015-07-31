var data=[];
var divStyle = {
  backgroundColor: '#aaccaa'
};

var Component = React.createClass({
  
  getInitialState:function(){
  return{ question:[],loginout:''}
  },
  updateState:function(){
   this.setState({question:data});
  console.log(this.state.question);
  },
  componentWillMount:function(){
    
    dpd.ques.get(function(result,err){
    data = result;
    
   
  });
 
 
    },
    
  componentDidMount:function(){
    setTimeout(this.updateState,150);
     
    },
   
    render:function(){
      var q = this.state.question.map(function(question){
        return <Question questionTitle={question.question} id = {question.id} options ={question.options} optionChoice = {question.optionChoice}/>;
      });
      return(<ol>
      <p> <form action="/postQuestion.html">
      <input type="submit"  className="btn btn-primary" value="Post a Question"/>
      </form>
     
      
      </p>
      <div className="panel-group" id="accordion">
          {q}
          </div>
        </ol>
        
      );
    }
  });

var Question = React.createClass({
  getInitialState:function(){
  return{options:[],chart:[],
  random:0
  }
  },
 
  updateState:function(op,ch,ra){
    this.setState({options:op,chart:ch,random:ra});
  },
 
  onclick1:function(id){
    window.location.href = 'presentQuestion.html?'+id;
  },
  render:function(){
    return(<div  style={divStyle} onClick={this.onclick1.bind(this,this.props.id)} id={"a"+this.props.id}  >
      <div className="panel panel-default">
      <div className="panel-heading">
      <h3 className='panel-title'>

      <a data-toggle="collapse" data-parent="#accordion" href={"#"+this.props.id}>{this.props.questionTitle}</a>

      </h3>
      <form method='put' id = {this.props.id}>
      <div id={this.props.id} className="panel-collapse collapse in">
      {this.state.options} {this.state.chart}
      </div>
      </form>
      </div>
      </div>
    
    
      
      </div>
    );
  }
});


React.render(<Component/>,document.getElementById("abc"));

  
