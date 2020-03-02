varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D blurredTexture;
uniform float strength;
void main() {
    vec4 original = texture2D(uSampler, vTextureCoord);
    vec4 blurred = texture2D(blurredTexture, vTextureCoord);
    gl_FragColor = original + (original - blurred) * strength;
}