import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Chart } from 'chart.js';
import * as moment from 'moment-timezone';

@Component({
  selector: 'page-data',
  templateUrl: 'data.html'
})

export class Data {
  @ViewChild('nosechart') nosechart;
  @ViewChild('eyeschart') eyeschart;
  @ViewChild('breathingchart') breathingchart;
  @ViewChild('tirednesschart') tirednesschart;
  @ViewChild('howimdoingchart') howimdoingchart;

  lineChart: any;
  public chartSelection = 'nose';

  // charts
  public chart = {
    nose: false,
    eyes: false,
    breathing: false,
    tiredness: false,
    howimdoing: false
  };

  public noseLoading = 'Loading...';
  public eyesLoading = 'Loading...';
  public breathingLoading = 'Loading...';
  public tirednessLoading = 'Loading...';
  public howimdoingLoading = 'Loading...';
  public allLoading = 'Loading...';

  // class constructor
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private storage: Storage) {

  }

  // load charts and show nose chart by default
  ionViewDidLoad() {
    this.loadCharts();
    this.hideAllCharts();
    this.chartSelection = 'nose';
    this.showChart();
  }

  // hide all the charts
  hideAllCharts() {
    this.chart.nose = true;
    this.chart.eyes = true;
    this.chart.breathing = true;
    this.chart.tiredness = true;
    this.chart.howimdoing = true;
  }

  // display selected chart
  showChart() {

    // first hide all charts
    this.hideAllCharts();

    // then show selected chart
    switch (this.chartSelection) {
      case 'nose':
        this.chart.nose = false;
        break;
      case 'coughing':
        this.chart.eyes = false;
        break;
      case 'mucus':
        this.chart.breathing = false;
        break;
      case 'tiredness':
        this.chart.tiredness = false;
        break;
      case 'howimdoing':
        this.chart.howimdoing = false;
        break;
      default:
        this.chart.nose = false;
        break;
    }
  }

  // load the chart data
  loadCharts() {
    console.log('Loading charts...');
    var self = this;
    this.storage.ready().then(() => {
      this.storage.get('graphdata').then((val) => {
        var graphData = val;

        // process data
        var noseRatings = ['Rating'];
        var eyesRatings = ['Rating'];
        var breathingRatings = ['Rating'];
        var tirednessRatings = ['Rating'];
        var howimdoingRatings = ['Rating'];
        var chartDates = ['Date'];

        for (var key in graphData) {
          if (graphData.hasOwnProperty(key)) {

            // date
            var t = moment.tz(graphData[key].readingDate, "Europe/London");
            var date = t.format("DD-MM");
            chartDates.push(date);

            // ratings
            noseRatings.push(graphData[key].nose);
            eyesRatings.push(graphData[key].eyes);
            breathingRatings.push(graphData[key].breathing);
            tirednessRatings.push(graphData[key].tiredness);
            howimdoingRatings.push(graphData[key].howimdoing);
          }
        }

        // draw nose graph
        if (noseRatings.length > 1) {
          this.plotChart(self.nosechart.nativeElement, chartDates, noseRatings);
          this.noseLoading = 'Ratings for nose symptoms';
        } else {
          this.noseLoading = 'No data to display.';
        }

        // draw eye graph
        if (eyesRatings.length > 1) {
          this.plotChart(self.eyeschart.nativeElement, chartDates, eyesRatings);
          this.eyesLoading = 'Ratings for eye symptoms';
        } else {
          this.eyesLoading = 'No data to display.';
        }

        // draw breathing graph
        if (breathingRatings.length > 1) {
          this.plotChart(self.breathingchart.nativeElement, chartDates, breathingRatings);
          this.breathingLoading = 'Ratings for breathing symptoms';
        } else {
          this.breathingLoading = 'No data to display.';
        }

        // draw tiredness graph
        if (tirednessRatings.length > 1) {
          this.plotChart(self.tirednesschart.nativeElement, chartDates, tirednessRatings);
          this.tirednessLoading = 'Ratings for tiredness symptoms';
        } else {
          this.tirednessLoading = 'No data to display.';
        }

        // draw howimdoing graph
        if (howimdoingRatings.length > 1) {
          this.plotChart(self.howimdoingchart.nativeElement, chartDates, howimdoingRatings);
          this.howimdoingLoading = 'Ratings for how I\'m doing';
        } else {
          this.howimdoingLoading = 'No data to display.';
        }

      });
    });
  }

  // plot the chars
  plotChart(chartID, chartDates, chartRatings) {

    // limit to 14 records
    if (chartDates.length > 14) {
      chartDates = chartDates.slice(Math.max(chartDates.length - 14, 1));
      chartRatings = chartRatings.slice(Math.max(chartRatings.length - 14, 1));
    }

    // make the chart
    this.lineChart = new Chart(chartID, {
      type: 'line',
      data: {
        labels: chartDates,
        datasets: [
          {
            fill: false,
            strokeLineWidth: 5,
            lineTension: 0.1,
            backgroundColor: "rgba(0,159,227,1)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(0,159,227,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 3,
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 20,
            data: chartRatings,
            spanGaps: false,
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              max: 3,
              stepSize: 1,
              beginAtZero: true
            }
          }]
        }
      }
    });

    //this.lineChart.config.data.datasets[0].pointBackgroundColor = "#00CCBB";
    //this.lineChart.update();
  }
}

