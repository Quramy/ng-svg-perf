import {Component, Input} from '@angular/core';
import {UserLink, User} from '../../../common/lib/user-link';
import {ElapseHolder} from '../../../common/lib/elapse-holder';
import * as d3 from 'd3';

interface UserNode extends User, d3.layout.force.Node {}
interface Link extends d3.layout.force.Link<UserNode> {};

@Component({
  selector: 'my-app',
  styles: [
    `
    `,
  ],
  template: `
  <article>
    <div>
      <label>
        items_count:
        <input type="number" [(ngModel)]="minItems"/>
      </label>
      <label>
        devide links:
        <input type="number" [(ngModel)]="linkDiv"/>
      </label>
      <button (click)="start()">restart</button>
    </div>
    <section>
      The number of nodes: <span class="measurement">{{nodes?.length}}</span>,
      The number of link: <span class="measurement">{{links?.length}}</span>,
      FPS: <span class="measurement">{{fps | number}}</span>
    </section>
    <section class="output">
      <svg>
        <g *ngIf="nodes?.length && links?.length">
          <line *ngFor="#link of links"
            [attr.x1]="link.source.x" [attr.y1]="link.source.y"
            [attr.x2]="link.target.x" [attr.y2]="link.target.y"
          ></line>
          <circle *ngFor="#node of nodes" r="5" [attr.title]="node?.id"
            [attr.cx]="node.x" [attr.cy]="node.y"
            [attr.fill]="hsl(node)"
            (click)="onClick(node)"
            [class.selected]="node?.id===selectedNode?.id"
          ></circle>
        </g>
      </svg>
      <div class="user">
        <div *ngIf="selectedNode">
          <img [attr.src]="selectedNode.raw.profile_image_url" alt=""> <br />
          <span>{{selectedNode.raw.id}}</span>
          <span>({{selectedNode.raw.items_count}} items)</span>
        </div>
      </div>
    </section>
  </article>
  `,
  directives: [],
  providers: [UserLink],
})

export class MyApp {

  private minItems = 40;
  private linkDiv = 5;

  private links: Link[];
  private nodes: UserNode[];

  private name = 'My Angular2 first app';
  private selectedNode: User;

  private elapseHolder = new ElapseHolder();

  constructor(private UserLink: UserLink) {
  }

  onClick(node: UserNode) {
    console.log(node);
    this.selectedNode = node;
  }

  hsl(node: UserNode) {
    const s = Math.min(20 + node.raw.items_count * .8, 100);
    return `hsl(310, ${s}%, 65%)`;
  }

  ngOnInit() {
    this.start();
  }
  start() {
    //console.log(nodes, links);

    this.UserLink.pickup({
      minItems: this.minItems,
      linkDiv: this.linkDiv
    });

    const size = 600;

    const force = d3.layout.force()
      .nodes(this.UserLink.nodes())
      .links(this.UserLink.links())
      .size([size, size])
      .gravity(1.1)
      .friction(0.98)
      .charge((node: UserNode) => -(node.raw.items_count + 5) * size / 30)
      .linkDistance(size / 18.0)
      .linkStrength((link: Link) => (link.source.raw.followers_count + link.target.raw.followers_count) / size * 5)
      .alpha(.9)
    ;

    this.nodes = <UserNode[]>force.nodes();
    this.links = <Link[]>force.links();

    force.on('end', (a) => {
      //force.resume();
    });

    force.on('tick', () => {
      this.elapseHolder.end();
      this.elapseHolder.start();
    });

    this.elapseHolder.reset();
    force.start();
  }

  get fps() {
    return (1000 / this.elapseHolder.average()) || 0;
  }

}
