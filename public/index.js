var data=[];
var divStyle = {
  backgroundColor: '#aaccaa'
};

var Component = React.createClass({
  
  getInitialState:function(){
  return{ question:[]}
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
      <form action="/index1.html">
      <input type="submit"  className="btn btn-primary" value="Post a Question"/>
      </form>
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
  submitAns:function(id){
  var optionAns=[];
  var op1=document.getElementsByName(id);

  dpd.ques.get(id, function (result) {
  
    if(result.optionChoice==1){
  for(var i=0;i<op1.length-1;i++){
  if(op1[i].checked){
    optionAns.push(result.countYN[i]+1);
  }else{
    optionAns.push(result.countYN[i]);
  }
  }

  dpd.ques.put(id, {countYN:optionAns}, function(result, err) {
  if(err) return console.log(err);
 
  });
  }
  else{
  for(var i=0;i<op1.length-1;i++){
  if(op1[i].checked==true){
    optionAns.push(result.countMultipleChoice[i]+1);
  }else{
    optionAns.push(result.countMultipleChoice[i]);
  }
  }

  dpd.ques.put(id, {countMultipleChoice:optionAns}, function(result, err) {
  if(err) return console.log(err);
  });
  }
  });

 // setTimeout(this.updateState.bind(this,optionsToBeShown,chartToBeShown,Math.random()), 100);
  setTimeout(function () { window.location.reload(); }, 50);
  },
  
  onclick:function(opti){

   var optionsToBeShown=[],
   chartToBeShown=[],
   labelsToBeShown=[];

   var currentId = this.props.id;
   var a=this;
  
  
/*     for(var i=0;i<opti.length;i++){
      if(opti[0]=='Yes')
      optionsToBeShown.push(<h4 id={currentId}>&nbsp;{'('+String.fromCharCode(65+optionsToBeShown.length)+')'}<input type='radio'name={currentId}/>{opti[i]}</h4>);
        else{
      optionsToBeShown.push(<h4 id={currentId}>&nbsp;{'('+String.fromCharCode(65+optionsToBeShown.length)+')'}<input type='checkbox'name={currentId}/>{opti[i]}</h4>);
        }

     console.log(optionsToBeShown);
}
     optionsToBeShown.push(<h4 id={currentId}><input type='submit'className = "btn btn-primary"method= 'post'value = 'Submit'onClick = {a.submitAns.bind(a,currentId)} 
      name={currentId}/></h4>);

*/
      dpd.ques.get(currentId,function(result){
      var temp = result;
      if(opti[0]=='Yes'){
        for(var i=0;i<opti.length;i++)
          optionsToBeShown.push(<h4 id={currentId}>&nbsp;{'('+String.fromCharCode(65+optionsToBeShown.length)+')'}&nbsp;<input type='radio'name={currentId}/>&nbsp;{opti[i]}&nbsp;<span className='badge'>{temp.countYN[i]}</span></h4>);
      
      chartToBeShown.push(<BarChart width={250} height= {100} data = {result.countYN} opt={result.options}/>);
      }
      else{
        for(var i=0;i<opti.length;i++)
        optionsToBeShown.push(<h4 id={currentId}>&nbsp;{'('+String.fromCharCode(65+optionsToBeShown.length)+')'}&nbsp;<input type='checkbox'name={currentId}/>&nbsp;{opti[i]}&nbsp;<span className='badge'>{temp.countMultipleChoice[i]}</span></h4>);
     
      chartToBeShown.push(<BarChart width={250} height= {100} data = {result.countMultipleChoice} opt={result.options}/>);
      }
        optionsToBeShown.push(<h4 id={currentId}>&nbsp;&nbsp;<input type='submit'className = "btn btn-primary"method= 'post'value = 'Submit'onClick = {a.submitAns.bind(a,currentId)} 
      name={currentId}/></h4>);
      });


     

     

  setTimeout(this.updateState.bind(this,optionsToBeShown,chartToBeShown,Math.random()), 20);

  },
  onclick1:function(id){
    window.location.href = 'showQuestion.html?Qid='+id;
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

var Chart = React.createClass({
  render:function(){
    return(<svg width={this.props.width} height = {this.props.height}>{this.props.children}</svg>);
  }
});

var Bar = React.createClass({
  getDefaultProps:function(){
    return{
      width:0,
      height:0,
      offset:0
    }
  },
  render:function(){
    return(
<rect fill={this.props.color}
width={this.props.width}
height={this.props.height}
x ={this.props.offset}
y= {this.props.availableHeight-this.props.height}/>
      );
  }
});
var Text = React.createClass({
  render:function(){
    return(
<text 

x={this.props.offset}
y= {this.props.availableHeight-this.props.height}

>
{this.props.option}
</text>
      );
  }
});
var DataSeries = React.createClass({
  getDefaultProps: function() {
    return {
      title:'',
      data: []
    }
  },

  render: function() {
    var props = this.props;

    var yScale = d3.scale.linear()
      .domain([0, d3.max(this.props.data)])
      .range([0, this.props.height]);

    var xScale = d3.scale.ordinal()
      .domain(d3.range(this.props.data.length))
      .rangeRoundBands([0, this.props.width], 0.05);

    var bars = _.map(this.props.data, function(point, i) {
      return (
        <Bar height={yScale(point)} width={xScale.rangeBand()} offset={xScale(i)} availableHeight={props.height} color={props.color} key={i} />
             )
    });
    var text = _.map(this.props.opt,function(point,i){
      return(<Text height='4'  offset = {xScale(i)+xScale.rangeBand()/2.6} availableHeight={props.height} option = {'('+String.fromCharCode(65+i)+')'} color='#ffffff'/>
        
        )
    });

    return (
      <g id='a'>
      {bars}
      {text}
      </g>
    );
  }
});


var BarChart = React.createClass({
  render: function() {
    return (
      <Chart width={this.props.width} height={this.props.height}>
        <DataSeries opt={this.props.opt} data={this.props.data} width={this.props.width} height={this.props.height}  color="teal" />
      
      </Chart>
    );
  }
});


React.render(<Component/>,document.getElementById("abc"));

  
