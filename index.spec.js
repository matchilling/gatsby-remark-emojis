const assert = require('chai').assert;
const component = require('.');
const pkg = require('./package.json');
const sinon = require('sinon');

describe(`${pkg.name}@${pkg.version}`, () => {
  it('component exports a function "mutateSource"', () => {
    assert.equal(typeof component.mutateSource, 'function');
  });

  describe('#mutateSource', () => {
    let content;
    let markdownNode, options = {};

    beforeEach(() => {
      content = new String('Some content :100:!');
      sinon.spy(content, 'replace');

      markdownNode = {
        internal: { content }
      };
      options = {
        active: true,
        size: 16
      };
    });

    it('throws a TypeError if first argument is undefined', () => {
      assert.throws(
        () => component.mutateSource(),
        TypeError,
        'Cannot destructure property `markdownNode` of \'undefined\' or \'null\''
      );
    });

    it('returns a promise', () => {
      component.mutateSource({ markdownNode: {} }).then(res => {
        assert.equal(res, undefined);
      });
    });

    it('renders an emoji correctly', async () => {
      await component.mutateSource({ markdownNode }, options);

      assert.equal(
        markdownNode.internal.content,
        'Some content <img alt="emoji-100" data-icon="emoji-100" style="" src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACClBMVEUAAADgAADNAADPAADKAADMAACjAADOAADHAADEAABqAADdAADGAADnAAC9AADDAADxAAC0AADLAADBAADCAADpAADZAADaAADJAAC8AACpAADfAADFAAD/AADiAAC/AADVAADUAADTAAC+AADIAADbAAC2AADQAACPAADbAADSAADMAADVAADNAADOAADJAADHAADOAADOAADHAADHAADLAADSAADIAADEAADIAADEAADIAADKAADHAADDAADIAADFAADPAADIAADEAADEAADGAADDAADJAADHAADFAADCAADLAADFAAC+AADMAADHAADFAADGAADFAADFAADKAADGAADEAADJAADJAADEAADLAADFAADHAADEAAD/AADHAADGAADDAADiAADGAADDAAD/AADIAADDAADFAADFAADMAADFAADGAADFAADKAADEAADCAADOAADGAADCAADHAADEAADEAADDAADIAADDAADDAADDAADJAADEAAC4AADIAADIAADJAADKAADIAADIAADJAADFAADIAADFAADEAADGAADDAADLAADFAADQAADGAADFAADIAADKAADGAADJAADXAADOAADKAADHAADGAADFAADFAADEAADEAADGAADIAADPAADGAADEAADEAADEAADDAADDAADEAAC3AADBAADMAADEAAC+AAD////BXOMGAAAArXRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUKEgcxFGR9IhySeDIQhsmAsFhyiZFEcBaU6LS2SjiruihJiQETUbmWrw5U458CbYA8sIeJApbkdAaqUwGJfXyLRbyomGy2GB+3MUO+vVwvoqlHUY8CKUc+UE8xaVF3tZJZBDYXEWRWQ0hJOwUqYI+vt7SmloEyIJybaj8kEwkEAQQRBC+ZeWsAAAABYktHRK0gYsIdAAAAB3RJTUUH4woMBxQZE+gNhQAAAQNJREFUGNNjYGBgZGJmYWXTZOfQ0mbg5GJg4OZh19HV0zcwNDI2MeXlY2DgZzEzt7C0sraxtbN3EBBkYGB3dHJ2cXVz9/D08vbx5WBgEPLzDwgMCg4JDQuPiGQRZmBgZYmKjomNi09ITEpOERFmEBVLTUvPyMzKzsnNyy/gZ2YQZy8sKi4pLSuvqKyqlpCUYpCWqamtk61vaGxqbpHjkWdgUOBrbTNrz+mIDuvs6uZUZGBQUu7p7eufMHHS5JIpfipKDAwsilOnTZ8xc9bsOXPnzedkYmBQZVqwcNHiJUuXLV+xUo1blgHosFWr14hw8nPKSMpwqGsABVhZZYQ5ePgZcAEAK4I+IgrMGqkAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDQtMDZUMjA6MjA6NDMrMDA6MDBiSxACAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA0LTA2VDIwOjIwOjQzKzAwOjAwExaovgAAAABJRU5ErkJggg==" title="emoji-100" />!'
      );
    });

    describe('plugin options', () => {
      let content;
      let markdownNode, options = {};

      beforeEach(() => {
        content = new String('Some content :100:!');
        sinon.spy(content, 'replace');

        markdownNode = {
          internal: { content }
        };
        options = {
          active : true,
          escapeCharacter : '',
          size   : 16
        };
      });

      describe('active', () => {
        it('does not change source if not active', () => {
          options.active = false;
          component.mutateSource({ markdownNode }, options)
          .then(res => {
            sinon.assert.notCalled(markdownNode.internal.content.replace);
            assert.equal(res, undefined);
          });
        });
      });

      describe('escapeCharacter', () => {
        it('does not change source if pattern not found', async () => {
          options.escapeCharacter = '#';
          markdownNode.internal.content = new String('Some content :100:!');

          await component.mutateSource({ markdownNode }, options);

          assert.equal(
            markdownNode.internal.content,
            'Some content :100:!'
          );
        });

        it('prepends the emoji pattern and renders an emoji correctly', async () => {
          options.escapeCharacter = '#';
          markdownNode.internal.content = new String('Some content #:100:!');

          await component.mutateSource({ markdownNode }, options);

          assert.equal(
            markdownNode.internal.content,
            'Some content <img alt="emoji-100" data-icon="emoji-100" style="" src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACClBMVEUAAADgAADNAADPAADKAADMAACjAADOAADHAADEAABqAADdAADGAADnAAC9AADDAADxAAC0AADLAADBAADCAADpAADZAADaAADJAAC8AACpAADfAADFAAD/AADiAAC/AADVAADUAADTAAC+AADIAADbAAC2AADQAACPAADbAADSAADMAADVAADNAADOAADJAADHAADOAADOAADHAADHAADLAADSAADIAADEAADIAADEAADIAADKAADHAADDAADIAADFAADPAADIAADEAADEAADGAADDAADJAADHAADFAADCAADLAADFAAC+AADMAADHAADFAADGAADFAADFAADKAADGAADEAADJAADJAADEAADLAADFAADHAADEAAD/AADHAADGAADDAADiAADGAADDAAD/AADIAADDAADFAADFAADMAADFAADGAADFAADKAADEAADCAADOAADGAADCAADHAADEAADEAADDAADIAADDAADDAADDAADJAADEAAC4AADIAADIAADJAADKAADIAADIAADJAADFAADIAADFAADEAADGAADDAADLAADFAADQAADGAADFAADIAADKAADGAADJAADXAADOAADKAADHAADGAADFAADFAADEAADEAADGAADIAADPAADGAADEAADEAADEAADDAADDAADEAAC3AADBAADMAADEAAC+AAD////BXOMGAAAArXRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUKEgcxFGR9IhySeDIQhsmAsFhyiZFEcBaU6LS2SjiruihJiQETUbmWrw5U458CbYA8sIeJApbkdAaqUwGJfXyLRbyomGy2GB+3MUO+vVwvoqlHUY8CKUc+UE8xaVF3tZJZBDYXEWRWQ0hJOwUqYI+vt7SmloEyIJybaj8kEwkEAQQRBC+ZeWsAAAABYktHRK0gYsIdAAAAB3RJTUUH4woMBxQZE+gNhQAAAQNJREFUGNNjYGBgZGJmYWXTZOfQ0mbg5GJg4OZh19HV0zcwNDI2MeXlY2DgZzEzt7C0sraxtbN3EBBkYGB3dHJ2cXVz9/D08vbx5WBgEPLzDwgMCg4JDQuPiGQRZmBgZYmKjomNi09ITEpOERFmEBVLTUvPyMzKzsnNyy/gZ2YQZy8sKi4pLSuvqKyqlpCUYpCWqamtk61vaGxqbpHjkWdgUOBrbTNrz+mIDuvs6uZUZGBQUu7p7eufMHHS5JIpfipKDAwsilOnTZ8xc9bsOXPnzedkYmBQZVqwcNHiJUuXLV+xUo1blgHosFWr14hw8nPKSMpwqGsABVhZZYQ5ePgZcAEAK4I+IgrMGqkAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDQtMDZUMjA6MjA6NDMrMDA6MDBiSxACAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA0LTA2VDIwOjIwOjQzKzAwOjAwExaovgAAAABJRU5ErkJggg==" title="emoji-100" />!'
          );
        });
      });

      describe('class', () => {
        it('adds a "class" attribute', async () => {
          await component.mutateSource({ markdownNode }, {
            ...options,
            class  : 'emoji-icon'
          });

          sinon.assert.calledOnce(content.replace);
          assert.include(markdownNode.internal.content, 'class="emoji-icon"');
        });
      });

      describe('styles', () => {
        it('adds a "style" attribute', async () => {
          await component.mutateSource({ markdownNode }, {
            ...options,
            styles : {
              display      : 'inline',
              margin       : '0',
              'margin-top' : '1px',
              position     : 'relative',
              top          : '5px',
              width        : '25px'
            }
          });

          sinon.assert.calledOnce(content.replace);
          assert.include(
            markdownNode.internal.content,
            'style="display: inline; margin: 0; margin-top: 1px; position: relative; top: 5px; width: 25px"'
          );
        });
      });
    });
  });
});
