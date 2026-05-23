import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Mermaid } from './index'

const meta = {
  title: 'Components/Mermaid',
  component: Mermaid,
  parameters: {
    // layout: 'centered',
  },
  args: {
    source: '',
  },
} satisfies Meta<typeof Mermaid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    source: `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`,
  },
}

export const EmptyField: Story = {
  args: {
    source: null,
  },
}

export const Flowchart: Story = {
  args: {
    source: `graph LR
    A[Start] --> B{Decision}
    B -->|Yes| C[Process 1]
    B -->|No| D[Process 2]
    C --> E[End]
    D --> E`,
  },
}

export const SequenceDiagram: Story = {
  args: {
    source: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`,
  },
}

export const ClassDiagram: Story = {
  args: {
    source: `classDiagram
    class Animal{
        +String name
        +eat()
    }
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    Animal <|-- Duck
    Animal <|-- Fish`,
  },
}

export const StateDiagram: Story = {
  args: {
    source: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,
  },
}

export const GanttChart: Story = {
  args: {
    source: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d`,
  },
}

export const PieChart: Story = {
  args: {
    source: `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`,
  },
}

export const Mindmap: Story = {
  args: {
    source: `mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping`,
  },
}

export const ERDiagram: Story = {
  args: {
    source: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
  },
}
