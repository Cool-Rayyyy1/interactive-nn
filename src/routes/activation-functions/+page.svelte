<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import { step, sigmoid, tanh, relu } from '$lib/math/latex';
	import { Math } from 'svelte-math';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const keys = ['activation'];
</script>

<div class="flex justify-center">
	<article class="prose lg:prose-xl max-w-4xl">
		<!-- INTRO -->
		<div id="what-is-an-activation-function" class="space-y-4">
			<h1>What is an Activation Function?</h1>

			<p>
				An activation function helps a neural network decide
				<strong>how strongly a neuron should respond</strong>
				to information.
			</p>

			<p>
				You can think of it like a decision switch:
				should the neuron activate a little, a lot, or not at all?
			</p>

			<p>
				Without activation functions, neural networks could only learn
				simple straight-line relationships and would not be able to recognize
				complex patterns like images, handwriting, or speech.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
	<!-- LINEAR -->
	<Card.Root class="p-6 space-y-4">
		<div>
			<h3 class="mt-0">Without Activation Function</h3>

			<p>
				A neural network without activation functions can only learn
				straight-line relationships.
			</p>
		</div>

		<div class="flex justify-center">
			<Math latex={'y = 2x + 1'} />
		</div>

		<div class="h-48 flex items-center justify-center rounded-xl bg-slate-50 border">
			<svg viewBox="0 0 300 200" class="w-full h-full">
				<!-- axis -->
				<line x1="40" y1="160" x2="260" y2="160" stroke="#94a3b8" stroke-width="2" />
				<line x1="40" y1="160" x2="40" y2="30" stroke="#94a3b8" stroke-width="2" />

				<!-- straight line -->
				<line
					x1="50"
					y1="140"
					x2="240"
					y2="50"
					stroke="#22c55e"
					stroke-width="4"
				/>
			</svg>
		</div>

		<p class="text-sm text-slate-600">
			The model can only create simple straight-line patterns.
		</p>
	</Card.Root>

	<!-- NONLINEAR -->
	<Card.Root class="p-6 space-y-4">
		<div>
			<h3 class="mt-0">With Activation Function</h3>

			<p>
				Activation functions allow the neural network to learn more
				complex curved patterns.
			</p>
		</div>

		<div class="flex justify-center">
			<Math latex={'f(x) = \\frac{1}{1 + e^{-x}}'} />
		</div>

		<div class="h-48 flex items-center justify-center rounded-xl bg-slate-50 border">
			<svg viewBox="0 0 300 200" class="w-full h-full">
				<!-- axis -->
				<line x1="40" y1="160" x2="260" y2="160" stroke="#94a3b8" stroke-width="2" />
				<line x1="40" y1="160" x2="40" y2="30" stroke="#94a3b8" stroke-width="2" />

				<!-- sigmoid-like curve -->
				<path
					d="M50 140
					C90 140, 110 120, 140 100
					S190 60, 240 60"
					fill="none"
					stroke="#3b82f6"
					stroke-width="4"
					stroke-linecap="round"
				/>
			</svg>
		</div>

		<p class="text-sm text-slate-600">
			This flexibility helps neural networks recognize images,
			speech, and other real-world patterns.
		</p>
	</Card.Root>

	
</div>
<Card.Root class="p-6 bg-slate-50 border border-slate-200 space-y-6">
	<div class="space-y-2">
		<h3 class="mt-0">Why Activation Functions Matter</h3>

		<p>
			Imagine predicting a student's exam score based on
			hours studied.
		</p>

		<p>
			Real-world patterns are usually not perfectly straight lines.
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- LINEAR -->
		<div class="space-y-3">
			<h4 class="font-semibold">Linear Model</h4>

			<p class="text-sm text-slate-600">
				A simple model assumes every extra hour helps equally.
			</p>

			<div class="flex justify-center">
				<Math latex={'y = 5x'} />
			</div>

			<div class="h-56 rounded-xl border bg-white p-2">
				<svg viewBox="0 0 320 220" class="w-full h-full">
					<!-- axes -->
					<line
						x1="40"
						y1="180"
						x2="290"
						y2="180"
						stroke="#94a3b8"
						stroke-width="2"
					/>

					<line
						x1="40"
						y1="180"
						x2="40"
						y2="30"
						stroke="#94a3b8"
						stroke-width="2"
					/>

					<!-- labels -->
					<text x="120" y="205" font-size="12" fill="#64748b">
						Hours Studied
					</text>

					<text
						x="-120"
						y="15"
						transform="rotate(-90)"
						font-size="12"
						fill="#64748b"
					>
						Exam Score
					</text>

					<!-- straight line -->
					<line
						x1="55"
						y1="165"
						x2="270"
						y2="45"
						stroke="#22c55e"
						stroke-width="4"
						stroke-linecap="round"
					/>
				</svg>
			</div>
		</div>

		<!-- NONLINEAR -->
		<div class="space-y-3">
			<h4 class="font-semibold">Realistic Pattern</h4>

			<p class="text-sm text-slate-600">
				Improvement may slow down after many hours of studying.
			</p>

			<div class="flex justify-center">
				<Math latex={'f(x)'} />
			</div>

			<div class="h-56 rounded-xl border bg-white p-2">
				<svg viewBox="0 0 320 220" class="w-full h-full">
					<!-- axes -->
					<line
						x1="40"
						y1="180"
						x2="290"
						y2="180"
						stroke="#94a3b8"
						stroke-width="2"
					/>

					<line
						x1="40"
						y1="180"
						x2="40"
						y2="30"
						stroke="#94a3b8"
						stroke-width="2"
					/>

					<!-- labels -->
					<text x="120" y="205" font-size="12" fill="#64748b">
						Hours Studied
					</text>

					<text
						x="-120"
						y="15"
						transform="rotate(-90)"
						font-size="12"
						fill="#64748b"
					>
						Exam Score
					</text>

					<!-- curved line -->
					<path
						d="
							M55 170
							C90 145, 120 105, 165 80
							S235 55, 270 65
						"
						fill="none"
						stroke="#3b82f6"
						stroke-width="4"
						stroke-linecap="round"
					/>
				</svg>
			</div>
		</div>
	</div>

	<div class="rounded-xl border bg-white p-4 text-center">
		<p class="font-medium">
			Activation functions help neural networks learn realistic,
			non-linear patterns instead of only straight lines.
		</p>
	</div>
</Card.Root>
		

		<!-- STEP -->
		<div id="step" class="mt-12 space-y-4">
			<h2>Step Function</h2>

			<p>
				The Step Function is one of the simplest activation functions.
			</p>

			<p>
				It behaves like an ON/OFF switch:
			</p>

			<ul>
				<li>Negative input → output becomes -1</li>
				<li>Zero input → output becomes 0</li>
				<li>Positive input → output becomes 1</li>
			</ul>

			<div class="grid grid-cols-1 gap-y-2">
				<Card.Root class="flex items-center justify-center p-6">
					<Math latex={step} />
				</Card.Root>

				<ActivationChart data={data.stepData} showDx={false} {keys} />
			</div>
		</div>

		<!-- SIGMOID -->
		<div id="sigmoid" class="mt-12 space-y-4">
			<h2>Sigmoid Function</h2>

			<p>
				The Sigmoid function smoothly transforms values between 0 and 1.
			</p>

			<ul>
				<li>Very negative numbers become close to 0</li>
				<li>Very positive numbers become close to 1</li>
			</ul>

			<p>
				This is useful when a neural network needs to estimate probability,
				such as:
			</p>

			<ul>
				<li>Is this email spam?</li>
				<li>Is this image a cat?</li>
			</ul>

			<div class="grid grid-cols-1 gap-y-2">
				<Card.Root class="flex items-center justify-center p-6">
					<Math latex={sigmoid} />
				</Card.Root>

				<ActivationChart data={data.sigmoidData} showDx={false} {keys} />
			</div>
		</div>

		<!-- TANH -->
		<div id="tanh" class="mt-12 space-y-4">
			<h2>TanH Function</h2>

			<p>
				The TanH function is similar to the Sigmoid function, but its outputs
				range from -1 to 1.
			</p>

			<ul>
				<li>Negative inputs become negative outputs</li>
				<li>Positive inputs become positive outputs</li>
			</ul>

			<p>
				This helps the neural network represent information centered around 0.
			</p>

			<div class="grid grid-cols-1 gap-y-2">
				<Card.Root class="flex items-center justify-center p-6">
					<Math latex={tanh} />
				</Card.Root>

				<ActivationChart data={data.tanhData} showDx={false} {keys} />
			</div>
		</div>

		<!-- RELU -->
		<div id="relu" class="mt-12 space-y-4">
			<h2>ReLU Function</h2>

			<p>
				ReLU stands for Rectified Linear Unit.
			</p>

			<p>
				It is one of the most commonly used activation functions in modern
				neural networks.
			</p>

			<ul>
				<li>Negative inputs become 0</li>
				<li>Positive inputs stay unchanged</li>
			</ul>

			<p>
				ReLU is simple, fast, and works very well for deep learning models.
			</p>

			<div class="grid grid-cols-1 gap-y-2">
				<Card.Root class="flex items-center justify-center p-6">
					<Math latex={relu} />
				</Card.Root>

				<ActivationChart data={data.reluData} showDx={false} {keys} />
			</div>
		</div>
	</article>
</div>