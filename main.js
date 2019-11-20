var eventBus = new Vue()

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">

        <div class="product-image">
            <img v-bind:src="image" >
        </div>
            
        <div class="product-info">
            <h1>{{ tittle }}</h1>
            <p v-if ="civilization > 10">In our civilization</p>
            <p v-else-if="civilization <= 10 && civilization > 0">Not in our Civilization</p>
            <p v-else>No information get</p>
            <p> shipping: {{ shipping }}</p>

            <p v-show="numberOfStars">342424</p>

            <ul>
                <li v-for="detail in details"> {{ detail }}</li>
            </ul>

            <!--
            <div v-for="galaxy in galaxies" :key="galaxy.galaxyColor">
                <p @mouseover="updateProduct(galaxy.galaxyImage)">{{ galaxy.galaxyColor }}</p>
            </div>
            -->

            <div v-for="(galaxy, index) in galaxies" 
                :key="galaxy.galaxyColor"
                class="color-box"
                :style ="{ backgroundColor: galaxy.galaxyColor }"
                @mouseover="updateProduct(index)">
            </div>

            <button v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disableButton: !inStock }">Add to Cart</button>

        </div>

        <product-tabs :reviews="reviews"></product-tabs>

    </div>
    `,
    data () { 
        return {
            brand: 'Colony',
            product: 'Galaxy',
            selectedGalaxy: 0,
            civilization: 34,
            numberOfStars: false,
            details: ["Spiral galaxy", "Supermasive balckhole", "Very much pulsars in the Galaxy"],
            galaxies: [
                {
                    galaxyId: 1,
                    galaxyColor: "blue",
                    recoursesQuantity: 2,
                    galaxyImage: './assets/images.jpg'
                },
                {
                    galaxyId: 2,
                    galaxyColor: "white",
                    recoursesQuantity: 0,
                    galaxyImage: './assets/images2.jpg'
                },
                {
                    galaxyId: 3,
                    galaxyColor: "yellow",
                    recoursesQuantity: 31,
                    galaxyImage: './assets/images3.jpg'
                }
            ],
            reviews: []
        }       
    },
    methods: {
        addToCart () {
            this.$emit('add-to-cart',this.galaxies[this.selectedGalaxy].galaxyId)
        },
        updateProduct (index) {
            this.selectedGalaxy = index
            console.log(index)
        }
    },
    computed: {
        tittle() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.galaxies[this.selectedGalaxy].galaxyImage
        },
        inStock() {
            return this.galaxies[this.selectedGalaxy].recoursesQuantity
        },
        shipping() {
            if (this.premium){
                return "Free"
            }
            return 2.99
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
    `,
    data() {
        return {
            name: null,
            review: null, 
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating){
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            }
            else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
    <div>
        <span class="tab"
            :class="{ activeTab: selectedTab === tab}"
            v-for="(tab, index) in tabs" 
            :key="index"
            @click="selectedTab = tab"
            >{{ tab }}</span>

        <div v-show="selectedTab === 'Reviews'">            
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul v-else>
                <li v-for="(review, index) in reviews"
                :key="index">
                <p>{{ review.name }}</p>
                <p>Rating: {{ review.rating }}</p>
                <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>

        <product-review v-show="selectedTab === 'Make a Review'"></product-review>

    </div>    
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        }
    }
});