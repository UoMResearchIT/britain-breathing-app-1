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
  public allLoading = 'Loading...';

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private storage: Storage) {

  }

  ionViewDidLoad() {
    this.loadCharts();
  }

  showChart(selection) {
    switch(selection) {
      case 'nose':
        this.chart.nose = false;
        this.chart.eyes = true;
        this.chart.breathing = true;
        this.chart.tiredness = true;
        this.chart.howimdoing = true;
        console.log('nose');
        break;
      case 'eyes':
        this.chart.nose = true;
        this.chart.eyes = false;
        this.chart.breathing = true;
        this.chart.tiredness = true;
        this.chart.howimdoing = true;
        console.log('eyes');
        break;
      case 'breathing':
        this.chart.nose = true;
        this.chart.eyes = true;
        this.chart.breathing = false;
        this.chart.tiredness = true;
        this.chart.howimdoing = true;
        console.log('breathing');
        break;
      case 'tiredness':
        this.chart.nose = true;
        this.chart.eyes = true;
        this.chart.breathing = true;
        this.chart.tiredness = false;
        this.chart.howimdoing = true;
        console.log('howimdoing');
        break;
      case 'howimdoing':
        this.chart.nose = true;
        this.chart.eyes = true;
        this.chart.breathing = true;
        this.chart.tiredness = true;
        this.chart.howimdoing = false;
        console.log('howimdoing');
        break;
      default:
        this.chart.nose = false;
        this.chart.eyes = true;
        this.chart.breathing = true;
        this.chart.tiredness = true;
        this.chart.howimdoing = true;
        console.log('default');
    }

    //this.loadCharts();
  }

  loadCharts() {
    console.log('Loading charts...');

    // Get the data
    var self = this;
    this.storage.ready().then(() => {
      this.storage.get('graphdata').then((val) => {
          var graphData = val;

          // Process the data
          var noseRatings = ['Rating'];
          var eyesRatings = ['Rating'];
          var breathingRatings = ['Rating'];
          var tirednessRatings = ['Rating'];
          var allRatings = ['Rating'];
          var chartDates = ['Date'];

          for(var key in graphData) {
            if(graphData.hasOwnProperty(key)) {
              // Date
              var t = moment.tz(graphData[key].readingDate, "Europe/London");
              var date = t.format("DD-MM");
              chartDates.push(date);

              // Nose ratings
              noseRatings.push(graphData[key].nose);

              // Eyes ratings
              eyesRatings.push(graphData[key].eyes);

              // Breathing ratings
              breathingRatings.push(graphData[key].breathing);

              // Tiredness ratings
              tirednessRatings.push(graphData[key].tiredness);

              // All ratings
              var ratingAverage = 0;
              if(graphData[key].nose > 0) { ratingAverage += graphData[key].nose}
              if(graphData[key].eyes > 0) { ratingAverage += graphData[key].eyes}
              if(graphData[key].breathing > 0) { ratingAverage += graphData[key].breathing}
              if(graphData[key].tiredness > 0) { ratingAverage += graphData[key].tiredness}
              ratingAverage = ratingAverage/3;
              ratingAverage = Math.round(ratingAverage*10)/10;

              allRatings.push(ratingAverage.toString());
            }
          }

          // Draw the nose graph
          if(noseRatings.length > 1) {
            this.plotChart(self.nosechart.nativeElement, chartDates, noseRatings);
            this.noseLoading = 'Ratings for nose symptoms';
          } else {
            // Show the no data message
            this.noseLoading = 'No data to display.';
          }

          // Draw the eyes graph
          if(eyesRatings.length > 1) {
            this.plotChart(self.eyeschart.nativeElement, chartDates, eyesRatings);
            this.eyesLoading = 'Ratings for eyes symptoms';
          } else {
            // Show the no data message
            this.eyesLoading = 'No data to display.';
          }

          // Draw the breathing graph
          if(breathingRatings.length > 1) {
            this.plotChart(self.breathingchart.nativeElement, chartDates, breathingRatings);
            this.breathingLoading = 'Ratings for breathing symptoms';
          } else {
            // Show the no data message
            this.breathingLoading = 'No data to display.';
          }

        // Draw the tiredness graph
        if(tirednessRatings.length > 1) {
          this.plotChart(self.tirednesschart.nativeElement, chartDates, tirednessRatings);
          this.tirednessLoading = 'Ratings for tiredness symptoms';
        } else {
          // Show the no data message
          this.breathingLoading = 'No data to display.';
        }

          // Draw the howimdoing graph
          if(allRatings.length > 1) {
            this.plotChart(self.howimdoingchart.nativeElement, chartDates, allRatings);
            this.allLoading = 'Average rating for all symptoms';
          } else {
            // Show the no data message
            this.allLoading = 'No data to display.';
          }

          setTimeout(function() {
            self.chart.nose = false;
            self.chart.eyes = true;
            self.chart.breathing = true;
            self.chart.tiredness = true;
            self.chart.howimdoing = true;
          },500);
        });
      });
    }

    plotChart(chartID, chartDates, chartRatings) {
      // Limit to 14 records
      if(chartDates.length > 14) {
        chartDates = chartDates.slice(Math.max(chartDates.length - 14, 1));
        chartRatings = chartRatings.slice(Math.max(chartRatings.length - 14, 1));
      }

      // Make the chart
      this.lineChart = new Chart(chartID, {
            type: 'line',
            data: {
                labels: chartDates,
                datasets: [
                    {
                        label: "Rating",
                        fill: true,
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
            }
        });
    }
}
