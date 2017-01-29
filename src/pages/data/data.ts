import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import c3 from 'c3';

@Component({
  selector: 'page-data',
  templateUrl: 'data.html'
})
export class Data {
  public chartSelection = 'nose';

  public chart = {
    nose: false,
    eyes: true,
    breathing: true,
    howimdoing: true
  };

  constructor(public navCtrl: NavController) {
    var self = this;
    setTimeout(function() {
      self.loadCharts();
    },1000);
  }

  showChart(selection) {
    switch(selection) {
      case 'nose':
        this.chart.nose = false;
        this.chart.eyes = true;
        this.chart.breathing = true;
        this.chart.howimdoing = true;
        console.log('nose');
        break;
      case 'eyes':
        this.chart.nose = true;
        this.chart.eyes = false;
        this.chart.breathing = true;
        this.chart.howimdoing = true;
        console.log('eyes');
        break;
      case 'breathing':
        this.chart.nose = true;
        this.chart.eyes = true;
        this.chart.breathing = false;
        this.chart.howimdoing = true;
        console.log('breathing');
        break;
      case 'howimdoing':
        this.chart.nose = true;
        this.chart.eyes = true;
        this.chart.breathing = true;
        this.chart.howimdoing = false;
        console.log('howimdoing');
        break;
      default:
        this.chart.nose = false;
        this.chart.eyes = true;
        this.chart.breathing = true;
        this.chart.howimdoing = true;
        console.log('default');
    }
  }

  loadCharts() {
    console.log('Loading charts...');

    c3.generate({
      bindto: '#nosechart',
      padding: {
        top: 20,
        right: 30
      },
      data: {
        x: 'x', // xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
        columns: [
              ['x', '2017-04-01', '2017-04-02', '2017-04-03', '2017-04-04', '2017-04-05', '2017-04-06', '2017-04-07'],
              ['Rating', 1, 0, 2, 0, 1, 2]
            ]
          },
          axis: {
              x: {
                  type: 'timeseries',
                  tick: {
                      format: '%Y-%m-%d'
                  }
              },
              y: {
                  max: 2,
                  min: 0,
                  padding: {top:10, bottom:0},
                  tick: {
                      format: d3.format('d')
                  }
              }
          }
      });

  c3.generate({
    bindto: '#eyeschart',
    padding: {
      top: 20,
      right: 30
    },
    data: {
      x: 'x', // xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
      columns: [
          ['x', '2017-04-01', '2017-04-02', '2017-04-03', '2017-04-04', '2017-04-05', '2017-04-06', '2017-04-07'],
          ['Rating', 0, 0, 2, 1, 1, 0]
          ]
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                }
            },
            y: {
                max: 2,
                min: 0,
                padding: {top:10, bottom:0},
                tick: {
                    format: d3.format('d')
                }
            }
        }
    });

  c3.generate({
    bindto: '#breathingchart',
    padding: {
      top: 20,
      right: 30
    },
    data: {
      x: 'x', // xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
      columns: [
            ['x', '2017-04-01', '2017-04-02', '2017-04-03', '2017-04-04', '2017-04-05', '2017-04-06', '2017-04-07'],
            ['Rating', 1, 2, 2, 0, 2, 2]
          ]
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                }
            },
            y: {
                max: 2,
                min: 0,
                padding: {top:10, bottom:0},
                tick: {
                    format: d3.format('d')
                }
            }
        }
    });

    c3.generate({
      bindto: '#howimdoingchart',
      padding: {
          top: 20,
          right: 30
      },
      data: {
        x: 'x', // xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
        columns: [
            ['x', '2017-04-01', '2017-04-02', '2017-04-03', '2017-04-04', '2017-04-05', '2017-04-06', '2017-04-07'],
            ['Rating', 2, 0, 0, 0, 1, 1]
            ]
          },
          axis: {
              x: {
                  type: 'timeseries',
                  tick: {
                      format: '%Y-%m-%d'
                  }
              },
              y: {
                  max: 2,
                  min: 0,
                  padding: {top:10, bottom:0},
                  tick: {
                      format: d3.format('d')
                  }
              }
          }
      });
  }
}
