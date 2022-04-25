<template>
  <DoughnutChart :width = "550" v-bind:chartData="testData" :options = "testOption" :plugins = "testPlugins">
  </DoughnutChart>
</template>

<script>
import { DoughnutChart } from 'vue-chart-3';

import { Chart, registerables } from "chart.js";

Chart.register(...registerables);
export default {
  name: "ProfileChart",
  components: {DoughnutChart},
  props:["size"],
  setup(props) {

    const testData = {
      labels: ['图片', '视频', '音乐', '其他文件','空余空间'],
      datasets: [
        {
          data: props.size,
          backgroundColor: ['crimson', '#0B63F6', 'mediumspringgreen', '#d57bff','grey'],
          borderColor: ['white'],
          borderWidth:[0],
          hoverBorderWidth:[3],
          indexLabelPlacement: "outside",
          rotation: 210,
          circumference:300,
          borderJoinStyle:"round",
          borderRadius:30,


        },
      ],
    };
    const testOption = {
      spacing: 2,
      cutout:"94%",
      radius:'75%',
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.dataset.data[context.dataIndex].actualSize} 占比${context.dataset.data[context.dataIndex].percentage}%`
            }
          }
        },
        title: {
          display: true,
          text: '使用情况总览 (*占比1.5%以下会被隐藏)',
          color: 'white',
          font: {
            size: 20
          }
        },
        legend:{
          onClick: function () {return;},
          position:'left',
          fullSize:false,
          labels: {
            usePointStyle: true,
            fontColor: "white",
            font: {
              size: 15,
            },
            padding:20,
            generateLabels(chart) {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                const {labels: {pointStyle}} = chart.legend.options;

                return data.labels.map((label, i) => {
                  const meta = chart.getDatasetMeta(0);
                  const style = meta.controller.getStyle(i);

                  return {
                    text: " " + label + ":" + chart.data.datasets[0].data[i].actualSize,
                    fillStyle: style.backgroundColor,
                    fontColor: "white",
                    strokeStyle: style.borderColor,
                    lineWidth: style.borderWidth,
                    pointStyle: pointStyle,
                    index: i
                  };
                });
              }
              return [];
            }
          },
          onHover: (evt, item, legend) => {
            const chart = legend.chart;
            const tooltip = chart.tooltip;
            const chartArea = chart.chartArea;

            tooltip.setActiveElements([{
              datasetIndex: 0,
              index: item.index,
            }], {
              x: (chartArea.left + chartArea.right) / 2,
              y: (chartArea.top + chartArea.bottom) / 2,
            });


            chart.update();
          },
        }
      },
      parsing:{
        key:"percentage",
      },


    };
    const testPlugins =[
      {
        id:'marginDown',
        afterInit(chart,args,options){
            const fitValue = chart.legend.fit;
            chart.legend.fit = function fit(){
              fitValue.bind(chart.legend)();
              let width  = this.width -= 10;
              return width;
            }
        }
      },

      {
        id: 'text',
        beforeDraw: function(chart, a, b) {

          var width = chart.chartArea.width,
              height = chart.chartArea.height,
              legendWidth = chart.legend.width,
              ctx = chart.ctx;


          ctx.restore();
          var fontSize = (height / 114).toFixed(2);
          ctx.font = fontSize + "em sans-serif";
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";
          let text = `${chart.data.datasets[0].data[4].percentage}%`,
              textX = width / 2 + legendWidth,
              textY = height / 2 + chart.chartArea.top +15;
          ctx.fillText(text, textX, textY);
          ctx.fillStyle = 'white';
          ctx.save();

          ctx.restore();
          var fontSize = (height / 200).toFixed(2);
          ctx.font = fontSize + "em sans-serif";
          ctx.textBaseline = "middle";
          let text2 = "剩余",
              text2X = width / 2 + legendWidth,
              text2Y = height / 2.8 + chart.chartArea.top+15;
          let text1 = "可用空间",
              text1X = width / 2 + legendWidth,
              text1Y = height /1.6 + chart.chartArea.top+15;
          ctx.fillStyle = 'white';
          ctx.fillText(text1, text1X, text1Y);
          ctx.fillText(text2, text2X, text2Y);
          ctx.save();
        }
      },
      {
        id:'textwithLine',
        afterDraw(chart,args,options){
          const {ctx, chartArea:{top,bottom,left,right,width,height}} =chart;
          chart.data.datasets.forEach((dataset,i) =>{
                chart.getDatasetMeta(i).data.forEach((datapoint,index) =>
                    {
                      const{x,y} = datapoint.tooltipPosition();
                      const halfwidth = width/2;
                      const halfheight = height/2;
                      const xLine = x >= halfwidth ? x+15:x-15;
                      const yLine = y >= halfwidth ? y+15:y-15;
                      const extraLine = x >=halfwidth ? 15:-15;
                      if(chart.data.datasets[0].data[index].percentage > 1.5){
                      ctx.beginPath();
                      ctx.moveTo(x,y);
                      ctx.lineTo(xLine,yLine);
                      ctx.lineTo(xLine + extraLine,yLine);
                      ctx.strokeStyle = dataset.backgroundColor[index];
                      ctx.stroke();
                      }

                      const textWidth = ctx.measureText(chart.data.labels[index]).width;
                      ctx.font = '15px Arial';

                      const textXPosition = x >= halfwidth ? 'left':'right';
                      ctx.textAlign = textXPosition;
                      ctx.textBaseline = 'middle';
                      ctx.fillStyle = 'white';
                      if(chart.data.datasets[0].data[index].percentage > 1.5){
                        if(textXPosition == 'right'){
                          ctx.fillText(`${chart.data.labels[index]} : ${chart.data.datasets[0].data[index].percentage}%`, xLine + extraLine-5,yLine);
                        }else{
                          ctx.fillText(`${chart.data.labels[index]} : ${chart.data.datasets[0].data[index].percentage}%`, xLine + extraLine+5,yLine);
                        }
                      }



                    }
                )
              }

          )
        }
      },
    ]


    return { testData,testOption,testPlugins};
  },
}
</script>

<style scoped>

</style>