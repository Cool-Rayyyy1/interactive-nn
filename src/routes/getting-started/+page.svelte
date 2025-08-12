<script>
	import Perceptron from '$lib/flows/perceptron.svelte';
	import { Math } from 'svelte-math';
	import * as Card from '$lib/components/ui/card/index.js';
	import { binary_step, weighted_sum, weighted_sum_example } from '$lib/math/latex';
	import WeatherPerceptron from '$lib/flows/weather-perceptron.svelte';
	import Mlp from '$lib/flows/mlp.svelte';
</script>

<div class="mt-4 flex justify-center">
	<article class="prose lg:prose-xl">
		<h2>Getting Started with Neural Networks</h2>
		<p>
			Neural Networks, sometimes abbrevaited "NN," are an important tool in Machine Learning that
			are used in a variety of applications, such as automatically recognizing handwritten letters
			and digits on letters, generating recommendations on social media, playing chess, and even
			predicting the stock market!
		</p>

		<p>
			Different variations of Neural Networks exist, and they can also be used as a component in
			larger, more complex Machine Learning systems, such as in the <a
				href="https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)"
				target="_blank">Transformer</a
			>
			architecture that is used in popular applications such as OpenAI's
			<a href="https://en.wikipedia.org/wiki/ChatGPT" target="_blank">ChatGPT</a>! In fact, GPT is
			an acronym for
			<a href="https://en.wikipedia.org/wiki/Generative_pre-trained_transformer" target="_blank"
				>generative pre-trained transformer</a
			>, a specific type of
			<a href="https://en.wikipedia.org/wiki/Large_language_model" target="_blank"
				>large language model</a
			>
			that uses Neural Networks as part of the overall model architecture. Other types of Neural Networks
			include
			<a href="https://en.wikipedia.org/wiki/Convolutional_neural_network" target="_blank"
				>convolutional neural networks</a
			>
			and
			<a href="https://en.wikipedia.org/wiki/Recurrent_neural_network" target="_blank"
				>recurrent neural networks</a
			>.
		</p>

		<p>
			Learning about the different components of Neural Networks and developing an intuition of the
			concepts, structure, and mathematical concepts that underpin it is an important step in
			advancing machine learning skills. Interactive NN seeks to introduce these concepts and ideas
			visually and intereactively so that students can build this intuition and background knowledge
			naturally.
		</p>

		<h3 id="what-is-a-neural-network">What is a Neural Network?</h3>

		<p>
			Neural Networks, as their name suggests, were originally inspired by <a
				href="https://en.wikipedia.org/wiki/Neural_network_(biology)"
				target="_blank">biological neural networks</a
			> in neuroscience, although their modern interpretation and application have diverged since these
			original ideas even if they share many vocabulary terms.
		</p>

		<p>
			Fundamentally, neurons are networks of different components, each connected together and
			serving a different function in the overall network to accomplish a task, such as providing
			social media recommendations. To better understand the overall function of a Neural Network,
			these different components will be broken down and studied individually. They include:
		</p>

		<ul>
			<li>Artificial Neurons, such as Perceptrons</li>
			<li>
				Inputs, which are <a href="https://en.wikipedia.org/wiki/Real_number" target="_blank"
					>real numbers</a
				>
			</li>
			<li>Activation Functions</li>
			<li>Hidden Layers</li>
		</ul>

		If a neural network contains three or more hidden layers, it is often called a "deep" Neural
		Network, which gives rise to the term<a
			href="https://en.wikipedia.org/wiki/Deep_learning"
			target="_blank">deep learning</a
		>!

		<h3 id="perceptrons">Perceptrons</h3>

		<p>
			A simple model of an artificial neuron is called the <a
				href="https://en.wikipedia.org/wiki/Perceptron"
				target="_blank">perceptron</a
			>. The idea for the perceptron dates back to
			<a
				href="https://en.wikipedia.org/wiki/A_Logical_Calculus_of_the_Ideas_Immanent_in_Nervous_Activity"
				target="_blank">1943</a
			>, and it was succesfully simulated with early computers in
			<a href="https://en.wikipedia.org/wiki/Frank_Rosenblatt#perceptron" target="_blank">1957</a>.
			Therefore, the percpetron is not a new idea, but it still forms the basis for other, more
			modern methods!
		</p>

		<p>The perceptron has three components:</p>

		<ul>
			<li>One or more binary inputs. Binary inputs are O or 1.</li>
			<li>Real number weights for each input, which describe how important each input is.</li>
			<li>A threshold value to determine the output</li>
		</ul>

		<p>These components are combined as follows:</p>

		<ul>
			<li>A weighted sum of the inputs and weights produces a value.</li>
			<li>
				That value is compared to the threshold value. If it is bigger than the threshold value, the
				ouput is 1. If it is less than the threshold, the ouput is 0.
			</li>
		</ul>

		<p>That's it! Visually, a Peceptron with three inputs can be represented as:</p>

		<Perceptron />

		<h4 id="perceptron-example">Perceptron Example</h4>

		<p>Let's walk through a practical example using the perceptron structure.</p>

		<h4>Inputs</h4>

		The inputs <Math latex={'x_0, x_1, x_2'} /> to a perceptron are always binary - either <Math
			latex={'0'}
		/>
		or <Math latex={'1'} />. For this example, let's set the following values:

		<ul>
			<li>
				<Math latex="x_0 = 0" />
			</li>
			<li>
				<Math latex="x_1 = 1" />
			</li>
			<li>
				<Math latex="x_2 = 1" />
			</li>
		</ul>

		<h4>Weights</h4>

		Each input <Math latex={'x_0, x_1, x_2'} /> has a corresponding weight <Math
			latex={'w_0, w_1, w_2'}
		/> that controls how important it is to the output. The bigger the weight, the more important it
		is! Weights, unlike inputs, are
		<a href="https://en.wikipedia.org/wiki/Real_number" target="_blank">real numbers</a>. Real
		numbers can be thought of as any number on a number line, such as 0, 1, -0.5, and even <Math
			latex={'\\sqrt{2}'}
		/>! Real numbers are commonly denoted as <Math latex={'\\reals'} />.

		<Card.Root class="mt-2">
			<Card.Header>
				<Card.Title>Real Numbers Visualized on the Number Line</Card.Title>
			</Card.Header>
			<Card.Content class="items-center w-full">
				<img
					class="object-fit w-full"
					alt="Real numbers represented visually on a number line"
					src="/real-number-line.png"
				/>
			</Card.Content>
		</Card.Root>

		<p>Let's use the following weights:</p>

		<ul>
			<li>
				<Math latex="w_0 = 1.5" />
			</li>
			<li>
				<Math latex="w_1 = 0" />
			</li>
			<li>
				<Math latex="w_2 = 3" />
			</li>
		</ul>

		<h4>Weighted Sum</h4>

		<p>
			With the inputs and weights, the next step is to calculate their weighted sum. This means that
			every input is multiplied with its weight. Then, all of those results are added together.
		</p>

		<Card.Root class="flex items-center">
			<Math latex={weighted_sum} displayMode />
		</Card.Root>

		<ul>
			<li>
				<Math latex={'x_0 \\times w_0 = 0 \\times 1.5 = 0'} />
			</li>
			<li>
				<Math latex={'x_1 \\times w_1 = 1 \\times 0 = 0'} />
			</li>
			<li>
				<Math latex={'x_2 \\times w_2 = 1 \\times 3 = 3'} />
			</li>
		</ul>

		<p>And summed up together:</p>

		<ul>
			<li>
				<Math latex={'0 + 0 + 3 = 3'} />
			</li>
		</ul>

		<Card.Root class="flex items-center">
			<Math latex={weighted_sum_example} displayMode />
		</Card.Root>

		<h4>Threshold and Step Function</h4>

		<p>
			With the weighted sum, the last step is to compare it to the threshold value. The threshold
			value converts the raw output into a binary value - 0 or 1. The function that performs this
			conversion is called a Step Function.
		</p>

		<p>
			If we set the <Math latex={'\\text{Threshold } =  0'} />, the step function is defined as
			follows, where <Math latex={'x'} /> is the weigted sum:
		</p>

		<Card.Root class="flex items-center">
			<Math latex={binary_step} displayMode />
		</Card.Root>

		If we pass our weighted sum <Math latex={'x = 3'} /> into this function, we can see that <Math
			latex={'3 > 0'}
		/>. Thus, the binary output from this perceptron example is 1!

		<h4>Binary Outputs</h4>

		<p>
			There is a limit on what binary outputs -- 0 or 1 -- can tell us. A binary output is True or
			False, Yes or No, On or Off. There is only two possible outcomes.
		</p>

		<p>
			Binary outputs can still be useful, though. A practical example is creating a perceptron model
			to predict whether it will rain today. We could have seven inputs for each of the seven
			previous days. The input will be 1 if it rained, and 0 otherwise. The threshold is 1, and if
			the output is greater than 1, the model predicts rain. We can adjust the weights so that rain
			yesterday is weighted higher than rain seven days ago. In practical terms, this suggests that
			if rain yesterday is a better indicataor of rain today than than rain from several days ago.
		</p>

		<p>Here is our example:</p>

		<WeatherPerceptron />

		<p>Let's walk through the steps:</p>

		<ul>
			<li>Calculate the weighted sum of the inputs and their weights.</li>
			<li>Compare the weighted sum to the threshold value of the step function.</li>
			<li>Interpret the output! This perceptron's output is 0, so this predicts no rain today!</li>
		</ul>

		<p>The details of the math are left to you as an exercise!</p>

		<p>
			Even though it rained last Monday, Tuesday, and Wednesday, they are weighted less than more
			recent days, like Saturday or Sunday. So, the weighted sum does not meet the threshold, and
			our perceptron model predicts no rain.
		</p>

		<p>This is cool! But we have some questions:</p>

		<ul>
			<li>How do we find the weights? Are they random, or guesses?</li>
			<li>Can we change the weights if needed, such as for different seasons or locations?</li>
			<li>
				How do we choose the threshold value? What if a threshold of 0 or 2 is better at predicting
				rain in our model?
			</li>
			<li>
				What if we want to predict something other than rain, like if it will be rainy, cloudy,
				sunny? That is three choices, so it doesn't fit into the binary model where we only have two
				options!
			</li>
		</ul>

		<h3 id="building-on-perceptrons">Building on Perceptrons</h3>

		<p>
			Perceptrons are just the building block for Neural Networks. The power and innovation behind
			Neural Networks uses many groups of perceptron and different variations of the math. There is
			a lot of creativity in developing Neural Networks! Some innovations on this simple perceptron
			model include:
		</p>
		<ul>
			<li>Using real number inputs, instead of only binary inputs.</li>
			<li>Organizing groups of perceptrons into layers.</li>
			<li>Using the output of one layer of neurons as the input to the next layer.</li>
			<li>New activation functions besides the simple step function.</li>
			<li>
				Being able to predict the most likely output from a group, instead of answering simple
				binary questions.
			</li>
		</ul>

		<p>Here is a visual of a Neural Network, building on the perceptron model:</p>

		<Mlp />

		<p>
			This may look complicated, but we already have all of the skills needed to build and interpret
			a Neural Network like this. Continue with Interactive NN to learn about and experiment with
			these different components!
		</p>
	</article>
</div>
