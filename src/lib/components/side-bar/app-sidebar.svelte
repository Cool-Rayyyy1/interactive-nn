<script lang="ts" module>
  const data = {
    navMain: [
      {
        title: 'Getting Started',
        url: '/getting-started',
        items: [
          {
            title: 'What is a Neural Network?',
            url: '/getting-started#what-is-a-neural-network'
          },
          {
            title: 'Perceptrons',
            url: '/getting-started#perceptrons'
          },
          {
            title: 'Building on Perceptrons',
            url: '/getting-started#building-on-perceptrons'
          }
        ]
      },
      {
        title: 'Activation Functions',
        url: '/activation-functions',
        items: [
          {
            title: 'What is an Activation Function?',
            url: '/activation-functions#what-is-an-activation-function'
          },
          {
            title: 'Step',
            url: '/activation-functions#step'
          },
          {
            title: 'Sigmoid',
            url: '/activation-functions#sigmoid'
          },
          {
            title: 'Tanh',
            url: '/activation-functions#tanh'
          },
          {
            title: 'ReLU',
            url: '/activation-functions#relu'
          }
        ]
      },
      {
        title: 'Perceptrons',
        url: '/one-input-perceptrons',
        items: [
          {
            title: 'One Layer',
            url: '/one-input-perceptrons/one-layer-perceptron-new'
          },
          {
            title: 'Two Layer',
            url: '/one-input-perceptrons/two-layer-perceptron'
          }
        ]
      },
      {
        title: 'Calculus',
        url: '/calculus',
        items: [
          {
            title: 'Motivation',
            url: '/calculus/motivation'
          },
          {
            title: 'Derivatives',
            url: '/calculus/derivatives'
          },
          {
            title: 'Derivatives of Activation Functions',
            url: '/calculus/derivatives-of-activation-functions'
          },
          {
            title: 'Gradient Descent',
            url: '/calculus/gradient-descent'
          },
          {
            title: 'Backpropagation',
            url: '/calculus/backpropagation'
          }
        ]
      }
    ]
  };
</script>

<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import type { ComponentProps } from 'svelte';

  let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {...restProps} bind:ref>
  <Sidebar.Header>
    <div class="flex flex-col place-items-center">
      <h1 class="text-xl font-bold text-blue-400">
        <a href="/">Interactive NN</a>
      </h1>
      <img class="object-fit h-32 w-32" alt="Interactive-NN Logo" src="/nn-icon.png" />
    </div>
  </Sidebar.Header>

  <Sidebar.Separator class="m-1" />

  <Sidebar.Content>
    {#each data.navMain as group (group.title)}
      <Sidebar.Group>
        <!-- 只在这里加大标题字号 -->
        <Sidebar.GroupLabel class="text-lg font-semibold">
          <a href={group.url}>{group.title}</a>
        </Sidebar.GroupLabel>

        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {#each group.items as item (item.title)}
              <Sidebar.MenuItem>
                <Sidebar.MenuButton>
                  {#snippet child({ props })}
                    <a href={item.url} {...props}>{item.title}</a>
                  {/snippet}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            {/each}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    {/each}
  </Sidebar.Content>

  <Sidebar.Footer>
    <Sidebar.Group>
      <Sidebar.GroupLabel class="text-md font-bold text-blue-400 hover:bg-sidebar-accent">
        <a href="/about">About</a>
      </Sidebar.GroupLabel>
    </Sidebar.Group>
  </Sidebar.Footer>

  <Sidebar.Rail />
</Sidebar.Root>
