import {ngModule} from '../ngModule';
import {UserLink, User} from '../../../common/lib/user-link';
import {ElapseHolder} from '../../../common/lib/elapse-holder';
import * as d3 from 'd3';

interface UserNode extends User, d3.layout.force.Node {}
interface Link extends d3.layout.force.Link<UserNode> {};

const template = `
  <article>
    <div>
      <label>
        items_count:
        <input type="number" ng-model="ctrl.minItems"/>
      </label>
      <label>
        devide links:
        <input type="number" ng-model="ctrl.linkDiv"/>
      </label>
      <button ng-click="ctrl.start()">restart</button>
    </div>
    <section>
      The number of nodes: <span class="measurement">{{ctrl.nodes.length}}</span>,
      The number of link: <span class="measurement">{{ctrl.links.length}}</span>
      FPS: <span class="measurement">{{ctrl.fps | number: 2}}</span>
    </section>
    <section class="output">
      <svg>
        <g ng-if="ctrl.nodes.length && ctrl.links.length">
          <line ng-repeat="link in ctrl.links"
            ng-attr-x1="{{link.source.x}}" ng-attr-y1="{{link.source.y}}"
            ng-attr-x2="{{link.target.x}}" ng-attr-y2="{{link.target.y}}"
          ></line>
          <circle ng-repeat="node in ctrl.nodes" r="5" title="node.id"
            ng-attr-cx="{{node.x}}" ng-attr-cy="{{node.y}}"
            ng-attr-fill="{{ctrl.hsl(node)}}"
            ng-click="ctrl.onClick(node)"
            ng-class="{selected: node.id===ctrl.selectedNode.id}"
          ></circle>
        </g>
      </svg>
      <div class="user">
        <div ng-if="ctrl.selectedNode">
          <img ng-src="{{ctrl.selectedNode.raw.profile_image_url}}" alt=""> <br />
          <span>{{ctrl.selectedNode.raw.id}}</span>
          <span>({{ctrl.selectedNode.raw.items_count}} items)</span>
        </div>
      </div>
    </section>
  </article>
`;
class MyAppComponent {

  private minItems = 40;
  private linkDiv = 5;

  private links: Link[];
  private nodes: UserNode[];
  private selectedNode: User;

  private elapseHolder = new ElapseHolder();

  constructor(
    private $scope: ng.IScope,
    private UserLink: UserLink
  ) {
    this.start();
  }

  hsl(node: UserNode) {
    const s = Math.min(20 + node.raw.items_count * .8, 100);
    return `hsl(310, ${s}%, 65%)`;
  }

  start() {
    this.UserLink.pickup({
      minItems: this.minItems,
      linkDiv: this.linkDiv,
    });

    const size = 600;

    let force = d3.layout.force()
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

    force.on('tick', () => {
      this.elapseHolder.end();
      this.elapseHolder.start();
      this.$scope.$digest();
    });

    force.on('end', () => {
      console.log(this.elapseHolder.average());
    });

    this.elapseHolder.reset();
    force.start();
  }

  get fps() {
    return 1000 / this.elapseHolder.average();
  }

  onClick(node: UserNode) {
    this.selectedNode = node;
  }
}

ngModule.component('myApp', {
  bindings: {},
  template,
  controller: MyAppComponent,
  controllerAs: 'ctrl'
});
