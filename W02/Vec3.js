class Vec3
{
    // Constructor
    constructor( x, y, z )
        {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    
    add( v )
        {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
        }
}

