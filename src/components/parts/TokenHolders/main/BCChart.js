import { Scatter, mixins } from 'vue-chartjs'
import Web3 from 'web3'
const toBN = Web3.utils.toBN
const BN = Web3.utils.BN
export default {
  props: ['emmited', 'change', 'params'],
  extends: Scatter,
  mixins:[mixins.reactiveData],

  watch: {
        emmited() {
            this.pricePoint.x = this.emmited
            this.pricePoint.y = this.p(this.emmited)
            this.$data._chart.update()
        },
        change() {
            const change = BN.min(BN.max(toBN(0), this.change),this.params.max)
            this.changePoint.x = change
            this.changePoint.y = this.p(change)
            this.$data._chart.update()
        },
        params() {
            this.maxPoint.x = this.params.max
            this.maxPoint.y = this.p(this.params.max)
            this.$data._chart.update()
        }
  },
  methods:{
      p(x){
            return toBN(x).div(this.params.k)
                      .add(this.params.startPrice)  / 1e18
      }
  },
  data(){
      const pricePoint = {x:this.emmited, y: this.p(this.emmited)}
      const changePoint = {x:this.change, y: this.p(this.change)}
      const maxPoint = {x:this.params.max, y: this.p(this.params.max)}
      return {
          pricePoint,
          changePoint,
          maxPoint,
          options:{
              scales: {
                xAxes: [{
                  type: 'linear',
                  position: 'bottom',
                  gridLines: {
                    color: '#365096',
                    lineWidth: .5
                  },
                  ticks: {
                      fontColor:"#defefe",
                      callback: function(value, index, values) {
                          return (value / 1e24).toFixed() + "M H" ;
                      }
                  }
                }],
                yAxes: [{
                    gridLines: {
                      color: '#365096',
                      lineWidth: .5
                    },
                    ticks: {
                      fontColor:"#defefe",
                      callback: function(value, index, values) {
                          return +value.toFixed(4) + ' ETH';
                      }
                    }
                  }]
              },
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false
              }
          },
      }
  },
  mounted () {
      this.chartData = {
          datasets: [
              {
                  label: 'Price Change',
                  data: [this.pricePoint, this.changePoint],
                  fill:true,
                  backgroundColor: '#45fff4d9',
                  showLine:true,
                  pointStyle:"line",
                  pointRadius:0
              },
              {
                  label: 'Current price',
                  backgroundColor: '#1d509e',
                  data: [{x:0, y:this.p(0)}, this.pricePoint],
                  fill:true,
                  pointRadius: 0,
                  showLine:true
              },
              {
                  label: 'Total distribution',
                  backgroundColor: '#0f546780',
                  data: [{x:0, y:this.p(0)}, this.maxPoint],
                  showLine:true,
                  pointRadius:0
              }
          ],
          labels: ['#667fcc']
      }
    this.renderChart(this.chartData, this.options)
  }
}
// #365096
