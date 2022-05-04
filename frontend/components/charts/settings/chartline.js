import THEME from 'assets/scss/PolkadotExporter.scss'; 

export class ChartLineOptions
{
	constructor(x, y)
	{
		this.setAxes(x, y);
	}

	setLabels(labels)
	{
		this.data.labels = labels;
	}

	setData(data)
	{
		this.data.datasets[0].data = data;
	}

	setAxes(x, y)
	{
		this.options.scales.xAxes[0].scaleLabel.labelString = x;
		this.options.scales.yAxes[0].scaleLabel.labelString = y;
	}

	data = 
	{
		datasets:
		[
			{
				borderColor: THEME.colorSecondary + '80',
				borderWidth: 1,
				pointBackgroundColor: 'transparent',
				pointBorderColor: 'transparent',
				hoverBackgroundColor: 'transparent',
				hoverBorderColor: THEME.colorFourth,
				pointRadius: 6,
				pointStyle: 'rect',
				hoverBorderWidth: 3,
				hoverRadius: 6,
				tension: 0,
				backgroundColor: THEME.colorSecondary + '40',
			},
		],
	}

	options = 
	{
		responsive: true,
		maintainAspectRatio: false,
		legend:
		{
			display: false,
		},
		tooltips:
		{
			backgroundColor: THEME.colorFourth,
			displayColors: false,
			titleFontColor: THEME.colorPrimary,
			titleFontStyle: '700',
			titleFontSize: 14,
			titleFontFamily: THEME.fontSecondary,
			titleMarginBottom: 4,
			titleSpacing: 0,
			bodyFontColor: THEME.colorFifth,
			bodyFontFamily: THEME.fontSecondary,
			bodyFontSize: 12,
			bodyFontStyle: 500,
			bodySpacing: 0,
			footerSpacing: 0,
			footerMarginTop: 0,
			yPadding: 6,
			xPadding: 8,
			cornerRadius: 3,
			caretSize: 6,
			caretPadding: 10,
		},
		scales:
		{
			xAxes:
			[
				{
					ticks:
					{
						beginAtZero: false,
						fontSize: 10,
						fontColor: THEME.colorFourth,
						fontFamily: THEME.fontSecondary,
						autoSkipPadding: 6,
						padding: 6,
					},
					gridLines:
					{
						display: true,
						color: THEME.colorFourth + '80',
						lineWidth: 0.2,
						zeroLineWidth: 2,
						zeroLineBorderDash: [5, 5],
						zeroLineColor: THEME.colorFourth,
					},
					scaleLabel:
					{
						display: true,
						fontSize: 16,
						fontStyle: '500',
						fontColor: THEME.colorFourthB,
						fontFamily: THEME.fontPrimary,
						padding: 16,
					},
				},
			],
			yAxes:
			[
				{
					ticks:
					{
						suggestedMin: 0,
						fontColor: THEME.colorFourth,
						autoSkipPadding: 12,
						padding: 6,
						fontSize: 10,
						fontFamily: THEME.fontSecondary,
					},
					gridLines:
					{
						color: THEME.colorFourth + '80',
						lineWidth: 0.2,
						zeroLineWidth: 2,
						zeroLineBorderDash: [5, 5],
						zeroLineColor: THEME.colorFourth,
					},
					scaleLabel:
					{
						display: true,
						fontSize: 16,
						fontStyle: '500',
						fontColor: THEME.colorFourthB,
						fontFamily: THEME.fontPrimary,
						padding: 16,
					}
				}
			]
		}
	}
}