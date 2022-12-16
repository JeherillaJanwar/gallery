console.clear();
console.log("System Started");

const stage = document.querySelector('svg');
const imgFg = document.querySelector('#imgFg')
const imgBg = document.querySelector('#imgBg')
const imgs = [
	'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=2000&q=50',
	'https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?w=2000&q=50',
	'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=2000&q=50',
	'https://images.unsplash.com/photo-1502657877623-f66bf489d236?w=2000&q=50',
	'https://images.unsplash.com/photo-1506361797048-46a149213205?w=2000&q=50'
]
const pos = {
	x: innerWidth / 2,
	y: innerHeight / 2
}

for (let i = 0; i < imgs.length; i++) {
	const img = document.createElementNS("http://www.w3.org/2000/svg", "image")
	imgBg.appendChild(img)
	gsap.set(img, {
		attr: {
			x: '-5%',
			y: '-5%',
			width: '110%',
			height: '110%',
			href: imgs[i],
			preserveAspectRatio: 'xMidYMid slice'
		}
	})
}

window.addEventListener('resize', () => {
	pos.x = innerWidth / 2
	pos.y = innerHeight / 2
	gsap.set('circle', {
		duration: 0.3,
		attr: {
			cx: pos.x,
			cy: pos.y
		}
	})
})

stage.addEventListener('mouseenter', (e) => {
	loop.pause()
	stage.addEventListener('mousemove', mouseFollow)
	mouseClickOn()
})

stage.addEventListener('mouseleave', (e) => {
	mouseClickOff()
	stage.removeEventListener('mousemove', mouseFollow)
	pos.x = innerWidth / 2
	pos.y = innerHeight / 2
	gsap.to('circle', {
		attr: {
			cx: pos.x,
			cy: pos.y
		},
		ease: 'power2.inOut'
	})
	gsap.to(imgFg.children[0], {
		attr: {
			x: '-5%',
			y: '-5%'
		}
	})
	loop.play(0)
})

function mouseClickOn() {
	stage.addEventListener('mousedown', maskConstrict)
	stage.addEventListener('mouseup', nextImg)
}

function mouseClickOff() {
	stage.removeEventListener('mousedown', maskConstrict)
	stage.removeEventListener('mouseup', nextImg)
}

function mouseFollow(e) {
	pos.x = e.pageX
	pos.y = e.pageY
	gsap.to('circle', {
		duration: 0.3,
		attr: {
			cx: pos.x,
			cy: pos.y
		}
	})
	gsap.to(imgFg.children[0], {
		attr: {
			x: gsap.utils.interpolate('0%', '-10%', pos.x / innerWidth),
			y: gsap.utils.interpolate('0%', '-10%', pos.y / innerHeight)
		}
	})
}

function maskConstrict(e) {
	gsap.to('circle', {
		duration: 0.3,
		attr: {
			r: (i) => [30, 50][i]
		}
	})
}

function nextImg() {
	mouseClickOff()
	gsap.timeline()
		.to('circle', {
			duration: 0.4,
			attr: {
				r: innerWidth
			},
			ease: 'power3.in',
			stagger: -0.1
		})
		.add(() => {
			imgFg.append(imgBg.children[imgBg.children.length - 1])
			imgBg.prepend(imgFg.children[0])
			gsap.set('circle', {
				attr: {
					r: 0
				}
			})
		})
		.fromTo('circle', {
			attr: {
				r: 0,
				cx: pos.x,
				cy: pos.y
			}
		}, {
			attr: {
				r: (i) => [35, 45][i]
			},
			ease: 'power2.inOut',
			stagger: -0.1
		}, 0.5)
		.add(mouseClickOn)
}

function scaleImg(t){
  gsap.fromTo(t, {scale:1, transformOrigin:'50%'}, {duration:4, scale:1.1, rotate:0.05, ease:'none'})
}

imgFg.append(imgBg.children[imgBg.children.length - 1])
gsap.fromTo('circle', {
	attr: {
		cx: pos.x,
		cy: pos.y
	}
}, {
	attr: {
		r: (i) => [35, 45][i]
	},
	ease: 'power2.inOut'
})
scaleImg(imgFg.children[0])
scaleImg(imgBg.children[imgBg.children.length-1])

const loop = gsap.timeline({
		repeatRefresh: true,
		repeat: -1
	})
	.add(maskConstrict, 3)
	.add(nextImg, 3.15)
