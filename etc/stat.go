package main

import (
	"fmt"
	"math/rand"
	"time"
)

type Pos struct {
	x, y int
}

func (b Pos) canTake(r Pos) bool {
	x := b.x - r.x
	y := b.y - r.y
	return x == y || x+y == 0
}

var bishop = Pos{2, 2}
var rook = Pos{7, 0}

const N = 10_000_000

func main() {
	seed := rand.NewSource(time.Now().UnixNano())
	rnd := rand.New(seed)
	wins := 0

	for game := 0; game < N; game++ {
		r := rook

		taken := false
		for move := 0; move < 15 && !taken; move++ {
			vert := rnd.Intn(2) == 1
			dist := 2 + rnd.Intn(6) + rnd.Intn(6)

			if vert {
				r.y = (r.y + dist) % 8
			} else {
				r.x = (r.x + dist) % 8
			}
			//fmt.Println("coin =", vert, "dice =", dist, "pos", r)
			taken = bishop.canTake(r)
		}
		if !taken {
			wins++
		}
	}
	fmt.Println(wins, "wins out of", N, "tries")
}
